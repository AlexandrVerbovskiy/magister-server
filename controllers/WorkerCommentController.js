const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class WorkerCommentController extends BaseCommentController {
  model = this.workerCommentModel;

  ratingJoin = async (items) => {
    items = await this.workerCommentModel.bindAverageForKeyEntities(
      items,
      "userId",
      {
        commentCountName: "userCommentCount",
        averageRatingName: "userAverageRating",
      }
    );
    items = await this.ownerCommentModel.bindAverageForKeyEntities(
      items,
      "reviewerId",
      {
        commentCountName: "reviewerCommentCount",
        averageRatingName: "reviewerAverageRating",
      }
    );
    return items;
  };

  createComment = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userCommentInfo, orderId } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getById(orderId);

      if (
        order.cancelStatus ||
        order.disputeStatus ||
        order.status != STATIC.ORDER_STATUSES.FINISHED ||
        order.ownerId != senderId
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const orderHasWorkerComment =
        await this.workerCommentModel.checkOrderHasComment(orderId);

      if (orderHasWorkerComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const workerCommentId = await this.workerCommentModel.create({
        ...userCommentInfo,
        orderId,
      });

      const chatId = order.chatId;

      const workerMessage =
        await this.chatMessageModel.createWorkerReviewMessage({
          chatId,
          senderId,
          data: { ...userCommentInfo },
        });

      const sender = await this.userModel.getById(senderId);

      this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
        message: workerMessage,
        opponent: sender,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        workerCommentId,
      });
    });
}

module.exports = WorkerCommentController;
