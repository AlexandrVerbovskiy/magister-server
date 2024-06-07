require("dotenv").config();
const BaseUserCommentModel = require("./BaseUserCommentModel");
const STATIC = require("../static");
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;

class OwnerCommentModel extends BaseUserCommentModel {
  type = "owner";
  keyField = `${LISTINGS_TABLE}.owner_id`;
  reviewerIdField = `${ORDERS_TABLE}.tenant_id`;
}

module.exports = new OwnerCommentModel();
