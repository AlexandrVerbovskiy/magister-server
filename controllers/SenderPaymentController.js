const STATIC = require("../static");
const {
  createPaypalOrder,
  workerPaymentCalculate,
  invoicePdfGeneration,
} = require("../utils");

const Controller = require("./Controller");

class SenderPaymentController extends Controller {
  paypalCreateOrder = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { userId } = req.userData;
      const { orderId, type: paypalType } = req.body;

      const order = await this.orderModel.getFullWithPaymentById(orderId);

      if (order.workerId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (
        order.cancelStatus ||
        order.disputeStatus ||
        order.status !== STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT ||
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

      const amount = workerPaymentCalculate(
        order.offerStartDate,
        order.offerEndDate,
        order.workerFee,
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

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

      await invoicePdfGeneration(payment, res);
    });

  updateBankTransferTransactionProof = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { orderId } = req.body;

      const order = await this.orderModel.getById(orderId);

      if (order.workerId != userId) {
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

      let newStatus = await this.orderModel.orderFinishedById(orderId);

      const chatId = order.chatId;

      if (chatId) {
        const message =
          await this.chatMessageModel.createWorkerPayedOrderMessage({
            chatId,
            senderId: order.workerId,
          });

        const worker = await this.userModel.getById(order.workerId);
        const owner = await this.userModel.getById(order.ownerId);

        await this.sendSocketMessageToUserOpponent(
          chatId,
          order.ownerId,
          "update-order-message",
          {
            message,
            opponent: worker,
            orderPart: { id: orderId, status: newStatus },
          }
        );

        await this.sendSocketMessageToUserOpponent(
          chatId,
          order.workerId,
          "update-order-message",
          {
            message,
            opponent: owner,
            orderPart: { id: orderId, status: newStatus },
          }
        );
      }

      this.sendPaymentNotificationMail(order.ownerEmail, order.id);
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
