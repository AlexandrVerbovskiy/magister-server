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
}

module.exports = new OwnerCommentController();
