require("dotenv").config();
const tenantCommentModel = require("./tenantCommentModel");

class TenantCommentModel extends tenantCommentModel {
  type = "tenant";
}

module.exports = new TenantCommentModel();
