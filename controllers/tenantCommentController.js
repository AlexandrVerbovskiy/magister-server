const BaseCommentController = require("./BaseCommentController");

class TenantCommentController extends BaseCommentController {
  model = this.tenantCommentModel;
}

module.exports = new TenantCommentController();
