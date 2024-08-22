const STATIC = require("../static");
const { createPaypalOrder, tenantPaymentCalculate } = require("../utils");

const Controller = require("./Controller");

class SenderPaymentController extends Controller {
  paypalCreateOrder = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { userId } = req.userData;
      const { orderId, type: paypalType } = req.body;

      const order = await this.orderModel.getFullWithPaymentById(orderId);

      if (order.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (
        order.cancelStatus ||
        order.disputeStatus ||
        order.status !== STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT ||
        (order.payedId &&
          order.payedType == STATIC.PAYMENT_TYPES.BANK_TRANSFER) ||
        order.payedAdminApproved
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Unable to perform an operation for the current order status"
        );
      }

      const amount = tenantPaymentCalculate(
        order.offerStartDate,
        order.offerEndDate,
        order.tenantFee,
        order.offerPricePerDay
      );

      const result = await createPaypalOrder(
        amount,
        orderId,
        order.listingName
      );

      await this.senderPaymentModel.deleteUnactualByPaypal(orderId);

      await this.senderPaymentModel.createByPaypal({
        money: amount,
        userId: userId,
        orderId: orderId,
        paypalOrderId: result.id,
        type: paypalType,
        hidden: true,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseSenderPaymentList = async ({
    req,
    totalCount,
    list,
    timeFilterType = STATIC.TIME_FILTER_TYPES.DURATION,
  }) => {
    const timeInfos = await this.getListTimeAutoOption(req, timeFilterType);

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      totalCount(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  baseAllSenderPaymentList = async (
    req,
    userId = null,
    timeFilterType = STATIC.TIME_FILTER_TYPES.DURATION,
    needPaymentTypeCount = false
  ) => {
    const type = req.body.type ?? "all";
    const status = req.body.status ?? "all";
    const filter = req.body.filter ?? "";

    const totalCount = (filter, timeInfos) =>
      this.senderPaymentModel.totalCount({
        filter,
        status,
        type,
        timeInfos,
        userId,
      });

    const list = (options) => {
      options["userId"] = userId;
      options["type"] = type;
      options["status"] = status;
      return this.senderPaymentModel.list(options);
    };

    const result = await this.baseSenderPaymentList({
      req,
      totalCount,
      list,
      timeFilterType,
    });

    if (needPaymentTypeCount) {
      const typesCount = await this.senderPaymentModel.getTransferTypesCount({
        filter,
        timeInfos: result.options.timeInfos,
        status,
      });
      result["typesCount"] = typesCount;
    }
    return result;
  };

  userList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      const result = await this.baseAllSenderPaymentList(
        req,
        userId,
        STATIC.TIME_FILTER_TYPES.DURATION
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAllSenderPaymentList(
        req,
        null,
        STATIC.TIME_FILTER_TYPES.TYPE,
        true
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  generateInvoicePdf = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;

      const payment = await this.senderPaymentModel.getFullById(id);

      if (!payment || payment.payerId != userId) {
        return res.sendStatus(404);
      }

      const buffer = await this.baseInvoicePdfGeneration(payment);
      res.contentType("application/pdf");
      res.send(buffer);
    });

  updateBankTransferTransactionProof = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { orderId } = req.body;

      const order = await this.orderModel.getById(orderId);

      if (order.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const proofUrl = await this.moveUploadsFileToFolder(
        req.file,
        "paymentProofs"
      );

      await this.senderPaymentModel.updateBankTransferTransactionProof(
        orderId,
        proofUrl
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        proofUrl,
      });
    });

  approveTransaction = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId } = req.body;

      const order = await this.orderModel.getFullById(orderId);

      if (order.cancelStatus) {
        return this.sendErrorResponse(
          res,
          STATIC.SUCCESS.FORBIDDEN,
          "Order was cancelled. You should return money to user"
        );
      }

      await this.senderPaymentModel.approveTransaction(orderId);

      let newStatus = null;

      if (order.orderParentId) {
        const { token: ownerToken, image: generatedImage } =
          await this.generateQrCodeInfo(
            STATIC.ORDER_OWNER_GOT_ITEM_APPROVE_URL
          );

        newStatus = await this.orderModel.orderTenantGotListing(orderId, {
          token: ownerToken,
          qrCode: generatedImage,
        });

        await this.recipientPaymentModel.paypalPaymentPlanGeneration({
          startDate: order.offerStartDate,
          endDate: order.offerEndDate,
          pricePerDay: order.offerPricePerDay,
          userId: order.ownerId,
          orderId: order.id,
          fee: order.ownerFee,
        });

        newStatus = await this.orderModel.orderFinishedById(orderId);
      } else {
        const { token: tenantToken, image: generatedImage } =
          await this.generateQrCodeInfo(
            STATIC.ORDER_TENANT_GOT_ITEM_APPROVE_URL
          );

        newStatus = await this.orderModel.orderTenantPayed(orderId, {
          token: tenantToken,
          qrCode: generatedImage,
        });
      }

      if (order.orderParentId) {
        const chatId = order.parentChatId;

        if (chatId) {
          const parentOrderExtensions = await this.orderModel.getOrderExtends(
            order.orderParentId
          );

          const orderPart = {
            id: order.orderParentId,
            extendOrders: parentOrderExtensions,
          };

          const message =
            await this.chatMessageModel.createTenantPayedExtensionMessage({
              chatId,
              senderId: order.tenantId,
              data: {
                offerStartDate: order.offerStartDate,
                offerEndDate: order.offerEndDate,
                offerPrice: order.offerPricePerDay,
                extensionId: order.id,
              },
            });

          const tenant = await this.userModel.getById(order.tenantId);
          const owner = await this.userModel.getById(order.ownerId);

          await this.sendSocketMessageToUserOpponent(
            chatId,
            order.ownerId,
            "update-order-message",
            {
              message,
              opponent: tenant,
              orderPart,
            }
          );

          await this.sendSocketMessageToUserOpponent(
            chatId,
            order.tenantId,
            "update-order-message",
            {
              message,
              opponent: owner,
              orderPart,
            }
          );

          await this.orderModel.orderUpdateEndDate(
            order.orderParentId,
            order.offerEndDate
          );
        }

        this.sendPaymentNotificationMail(order.ownerEmail, order.orderParentId);
      } else {
        const chatId = order.chatId;

        if (chatId) {
          const message =
            await this.chatMessageModel.createTenantPayedOrderMessage({
              chatId,
              senderId: order.tenantId,
            });

          const tenant = await this.userModel.getById(order.tenantId);
          const owner = await this.userModel.getById(order.ownerId);

          await this.sendSocketMessageToUserOpponent(
            chatId,
            order.ownerId,
            "update-order-message",
            {
              message,
              opponent: tenant,
              orderPart: { id: orderId, status: newStatus },
            }
          );

          await this.sendSocketMessageToUserOpponent(
            chatId,
            order.tenantId,
            "update-order-message",
            {
              message,
              opponent: owner,
              orderPart: { id: orderId, status: newStatus },
            }
          );
        }

        this.sendPaymentNotificationMail(order.ownerEmail, order.id);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  rejectTransaction = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, description } = req.body;
      const order = await this.orderModel.getById(orderId);
      const chatId = order.chatId;

      await this.senderPaymentModel.rejectTransaction(orderId, description);

      const paymentInfo =
        await this.senderPaymentModel.getInfoAboutOrderPayment(orderId);

      await this.sendSocketMessageToChatUsers(chatId, "update-order", {
        orderPart: { id: orderId, paymentInfo },
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = SenderPaymentController;
