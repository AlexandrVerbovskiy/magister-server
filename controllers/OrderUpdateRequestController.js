const STATIC = require("../static");
const Controller = require("./Controller");

class OrderUpdateRequestController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, newStartDate, newEndDate } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getFullById(orderId);

      const { workerId, ownerId } = order;

      if (
        !(
          (order.status == STATIC.ORDER_STATUSES.PENDING_WORKER &&
            order.workerId == senderId) ||
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

      if (lastInfo) {
        if (lastInfo.senderId == senderId) {
          return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
        }

        await this.orderUpdateRequestModel.closeLast(orderId);
      }

      let newStatus = null;

      if (workerId == senderId) {
        newStatus = await this.orderModel.setPendingOwnerStatus(orderId);
      }

      const fee = await this.systemOptionModel.getWorkerBaseCommissionPercent();

      const createdRequestId = await this.orderUpdateRequestModel.create({
        orderId,
        newStartDate,
        newEndDate,
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
