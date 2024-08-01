const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class OwnerCommentController extends BaseCommentController {
  model = this.ownerCommentModel;

  ratingJoin = async (items) => {
    items = await this.ownerCommentModel.bindAverageForKeyEntities(
      items,
      "userId",
      {
        commentCountName: "userCommentCount",
        averageRatingName: "userAverageRating",
      }
    );
    items = await this.tenantCommentModel.bindAverageForKeyEntities(
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
      const { userCommentInfo, listingCommentInfo, orderId } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getById(orderId);

      if (
        order.cancelStatus ||
        order.disputeStatus ||
        order.status != STATIC.ORDER_STATUSES.FINISHED ||
        order.tenantId != senderId
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const orderHasOwnerComment =
        await this.ownerCommentModel.checkOrderHasComment(orderId);

      if (orderHasOwnerComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const orderHasListingComment =
        await this.listingCommentModel.checkOrderHasComment(orderId);

      if (orderHasListingComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const ownerCommentId = await this.ownerCommentModel.create({
        ...userCommentInfo,
        orderId,
      });

      const listingCommentId = await this.listingCommentModel.create({
        ...listingCommentInfo,
        orderId,
      });

      const chatId = order.chatId;

      const listingMessage =
        await this.chatMessageModel.createListingReviewMessage({
          chatId,
          senderId,
          data: listingCommentInfo,
        });

      const ownerMessage = await this.chatMessageModel.createOwnerReviewMessage(
        {
          chatId,
          senderId,
          data: userCommentInfo,
        }
      );

      const sender = await this.userModel.getById(senderId);

      this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
        message: listingMessage,
        opponent: sender,
      });

      this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
        message: ownerMessage,
        opponent: sender,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ownerCommentId,
        listingCommentId,
      });
    });
}

module.exports = OwnerCommentController;
