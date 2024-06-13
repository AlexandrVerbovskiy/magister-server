const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class ListingCommentController extends BaseCommentController {
  model = this.listingCommentModel;
  needListingImages = true;
}

module.exports = new ListingCommentController();
