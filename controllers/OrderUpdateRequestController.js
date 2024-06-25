const STATIC = require("../static");
const Controller = require("./Controller");

class OrderUpdateRequestController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, newStartDate, newEndDate, newPricePerDay } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getFullById(orderId);
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

      if (lastInfo) {
        if (lastInfo.senderId == senderId) {
          return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
        } else {
          await this.orderUpdateRequestModel.closeLast(orderId);
        }
      }

      if (tenantId == senderId) {
        await this.orderModel.setPendingOwnerStatus(orderId);
      }

      if (ownerId == senderId) {
        await this.orderModel.setPendingTenantStatus(orderId);
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

      let chatMessage = null;

      if (chatId) {
        const firstImage = order.listingImages[0];

        chatMessage = await this.chatMessageModel.createUpdateOrderMessage({
          chatId: order.chatId,
          senderId,
          data: {
            requestId: request.id,
            listingName: order.listingName,
            offerPrice: newPricePerDay,
            listingPhotoPath: firstImage?.link,
            listingPhotoType: firstImage?.type,
            offerDateStart: newStartDate,
            offerDateEnd: newEndDate,
          },
        });

        await this.sendMessageForOrder(chatMessage, senderId);
      }

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        { request, chatMessage }
      );
    });
}

module.exports = OrderUpdateRequestController;
