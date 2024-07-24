const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class TenantCommentController extends BaseCommentController {
  model = this.tenantCommentModel;

  ratingJoin = async (items) => {
    items = await this.tenantCommentModel.bindAverageForKeyEntities(
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

  createComment = async (req, res) => {
    const { userCommentInfo, orderId } = req.body;
    const senderId = req.userData.userId;

    const orderHasTenantComment =
      await this.tenantCommentModel.checkOrderHasComment(orderId);

    if (orderHasTenantComment) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const tenantCommentId = await this.tenantCommentModel.create({
      ...userCommentInfo,
      orderId,
    });

    const order = await this.orderModel.getById(orderId);
    const chatId = order.chatId;

    const tenantMessage = await this.chatMessageModel.createTenantReviewMessage(
      {
        chatId,
        senderId,
        data: { ...userCommentInfo },
      }
    );

    const sender = await this.userModel.getById(senderId);

    this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
      message: tenantMessage,
      opponent: sender,
    });

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      tenantCommentId,
    });
  };
}

module.exports = TenantCommentController;
