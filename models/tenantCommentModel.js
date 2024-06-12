require("dotenv").config();
const BaseUserCommentModel = require("./BaseUserCommentModel");
const STATIC = require("../static");
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;

class TenantCommentModel extends BaseUserCommentModel {
  type = "tenant";
  keyField = `${ORDERS_TABLE}.tenant_id`;
  reviewerIdField = `${LISTINGS_TABLE}.owner_id`;
}

module.exports = new TenantCommentModel();
