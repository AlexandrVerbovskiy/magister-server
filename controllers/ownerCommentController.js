const BaseCommentController = require("./BaseCommentController");

class OwnerCommentController extends BaseCommentController {
  model = this.ownerCommentModel;
}

module.exports = new OwnerCommentController();
