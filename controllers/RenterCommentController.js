const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class RenterCommentController extends BaseCommentController {
  model = this.renterCommentModel;

  ratingJoin = async (items) => {
    items = await this.renterCommentModel.bindAverageForKeyEntities(
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

      const orderHasRenterComment =
        await this.renterCommentModel.checkOrderHasComment(orderId);

      if (orderHasRenterComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const renterCommentId = await this.renterCommentModel.create({
        ...userCommentInfo,
        orderId,
      });

      const chatId = order.chatId;

      const renterMessage =
        await this.chatMessageModel.createRenterReviewMessage({
          chatId,
          senderId,
          data: { ...userCommentInfo },
        });

      const sender = await this.userModel.getById(senderId);

      this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
        message: renterMessage,
        opponent: sender,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        renterCommentId,
      });
    });
}

module.exports = RenterCommentController;
