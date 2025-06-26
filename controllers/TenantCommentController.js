const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
class TenantCommentController extends BaseCommentController {
  model = this.tenantCommentModel;

  ratingJoin = async (items) => {
    items = await this.tenantCommentModel.bindAverageForKeyEntities(
=======
=======
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
class RenterCommentController extends BaseCommentController {
  model = this.renterCommentModel;

  ratingJoin = async (items) => {
    items = await this.renterCommentModel.bindAverageForKeyEntities(
<<<<<<< HEAD:controllers/TenantCommentController.js
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
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

<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
      const orderHasTenantComment =
        await this.tenantCommentModel.checkOrderHasComment(orderId);

      if (orderHasTenantComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const tenantCommentId = await this.tenantCommentModel.create({
=======
=======
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
      const orderHasRenterComment =
        await this.renterCommentModel.checkOrderHasComment(orderId);

      if (orderHasRenterComment) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const renterCommentId = await this.renterCommentModel.create({
<<<<<<< HEAD:controllers/TenantCommentController.js
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
        ...userCommentInfo,
        orderId,
      });

      const chatId = order.chatId;

<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
      const tenantMessage =
        await this.chatMessageModel.createTenantReviewMessage({
=======
      const renterMessage =
        await this.chatMessageModel.createRenterReviewMessage({
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
      const renterMessage =
        await this.chatMessageModel.createRenterReviewMessage({
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
          chatId,
          senderId,
          data: { ...userCommentInfo },
        });

      const sender = await this.userModel.getById(senderId);

      this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
        message: tenantMessage,
=======
        message: renterMessage,
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
        message: renterMessage,
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
        opponent: sender,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
        tenantCommentId,
=======
        renterCommentId,
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
        renterCommentId,
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
      });
    });
}

<<<<<<< HEAD:controllers/TenantCommentController.js
<<<<<<< HEAD:controllers/TenantCommentController.js
module.exports = TenantCommentController;
=======
module.exports = RenterCommentController;
>>>>>>> fad5f76 (start):controllers/WorkerCommentController.js
=======
module.exports = RenterCommentController;
>>>>>>> 45e89f9 (start):controllers/WorkerCommentController.js
