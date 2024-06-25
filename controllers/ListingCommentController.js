const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class ListingCommentController extends BaseCommentController {
  model = this.listingCommentModel;
  needListingImages = true;

  ratingJoin = async (items) => {
    items = await this.listingCommentModel.bindAverageForKeyEntities(
      items,
      "listingId",
      {
        commentCountName: "listingCommentCount",
        averageRatingName: "listingAverageRating",
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

module.exports = ListingCommentController;
