const STATIC = require("../static");
const { checkStartEndHasConflict } = require("../utils");
const Controller = require("./Controller");

class OrderUpdateRequestController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, newStartDate, newEndDate } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getFullById(orderId);

      const dateErrorMessage = this.baseListingDatesValidation(
        newStartDate,
        newEndDate,
        order.listingMinRentalDays
      );

      if (dateErrorMessage) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          dateErrorMessage
        );
      }

      const { tenantId, ownerId } = order;

      if (
        !(
          (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT &&
            order.tenantId == senderId) ||
          (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
            order.ownerId == senderId)
        ) ||
        order.cancelStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastInfo = await this.orderUpdateRequestModel.getFullForLastActive(
        orderId
      );

      const blockedOrderDates =
        await this.orderModel.getBlockedListingsDatesForOrders([order.id]);

      const currentListingBlockedDates = blockedOrderDates[order.id];

      if (
        checkStartEndHasConflict(
          newStartDate,
          newEndDate,
          currentListingBlockedDates
        )
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Order has conflict orders"
        );
      }

      if (lastInfo) {
        if (lastInfo.senderId == senderId) {
          return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
        }

        await this.orderUpdateRequestModel.closeLast(orderId);
      }

      let newStatus = null;

      if (tenantId == senderId) {
        newStatus = await this.orderModel.setPendingOwnerStatus(orderId);
      }

      if (ownerId == senderId) {
        newStatus = await this.orderModel.setPendingTenantStatus(orderId);
      }

      const fee = await this.systemOptionModel.getTenantBaseCommissionPercent();

      const createdRequestId = await this.orderUpdateRequestModel.create({
        orderId,
        newStartDate,
        newEndDate,
        newPricePerDay: order.offerPricePerDay,
        senderId,
        fee,
      });

      const request = await this.orderUpdateRequestModel.getFullById(
        createdRequestId
      );

      const firstImage = order.listingImages[0];

      let chatId = order.chatId;
      let createMessageFunc = this.chatMessageModel.createUpdateOrderMessage;
      let messageData = {
        requestId: request.id,
        listingName: order.listingName,
        offerPrice: order.offerPricePerDay,
        listingPhotoPath: firstImage?.link,
        listingPhotoType: firstImage?.type,
        offerStartDate: newStartDate,
        offerEndDate: newEndDate,
      };
      let orderPart = {
        id: order.id,
        status: newStatus,
        actualUpdateRequest: request,
      };

      if (order.orderParentId) {
        chatId = order.parentChatId;
        createMessageFunc = this.chatMessageModel.createUpdateExtensionMessage;
        messageData["extensionId"] = order.id;

        const parentOrderExtensions = await this.orderModel.getOrderExtends(
          order.orderParentId
        );

        orderPart = {
          id: order.orderParentId,
          extendOrders: parentOrderExtensions,
        };
      }

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId,
        createMessageFunc,
        orderPart,
      });

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        { request, chatMessage, ...orderPart }
      );
    });
}

module.exports = OrderUpdateRequestController;
