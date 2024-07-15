const STATIC = require("../static");
const {
  checkStartEndHasConflict,
} = require("../utils");
const Controller = require("./Controller");

class OrderUpdateRequestController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, newStartDate, newEndDate, newPricePerDay } = req.body;
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

      const { tenantId, ownerId, chatId } = order;

      if (tenantId != senderId && ownerId != senderId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (
        (order.status != STATIC.ORDER_STATUSES.PENDING_OWNER &&
          order.status != STATIC.ORDER_STATUSES.PENDING_TENANT) ||
        order.cancelStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastInfo = await this.orderUpdateRequestModel.getFullForLastActive(
        orderId
      );

      const blockedListingsDates =
        await this.orderModel.getBlockedListingsDatesForListings(
          [order.listingId],
          tenantId == senderId ? senderId : null
        );

      const currentListingBlockedDates = blockedListingsDates[order.listingId];

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
        newPricePerDay,
        senderId,
        fee,
      });

      const request = await this.orderUpdateRequestModel.getFullById(
        createdRequestId
      );

      const firstImage = order.listingImages[0];

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId: order.chatId,
        messageData: {
          requestId: request.id,
          listingName: order.listingName,
          offerPrice: newPricePerDay,
          listingPhotoPath: firstImage?.link,
          listingPhotoType: firstImage?.type,
          offerDateStart: newStartDate,
          offerDateEnd: newEndDate,
        },
        senderId,
        createMessageFunc: this.chatMessageModel.createUpdateOrderMessage,
        orderPart: {
          id: order.id,
          status: newStatus,
          actualUpdateRequest: request,
        },
      });

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        { request, chatMessage }
      );
    });
}

module.exports = OrderUpdateRequestController;
