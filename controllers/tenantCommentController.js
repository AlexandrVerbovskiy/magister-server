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
}

module.exports = new TenantCommentController();
