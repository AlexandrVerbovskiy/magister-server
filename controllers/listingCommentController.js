const STATIC = require("../static");
const BaseCommentController = require("./BaseCommentController");

class ListingCommentController extends BaseCommentController {
  model = this.listingCommentModel;
}

module.exports = new ListingCommentController();
