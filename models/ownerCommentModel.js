require("dotenv").config();
const BaseUserCommentModel = require("./BaseUserCommentModel");
const STATIC = require("../static");
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const USERS_TABLE = STATIC.TABLES.USERS;

class OwnerCommentModel extends BaseUserCommentModel {
  type = "owner";
  keyField = `${LISTINGS_TABLE}.owner_id`;
  reviewerIdField = `${ORDERS_TABLE}.tenant_id`;

  getBaseUserStatisticQueryJoin = (query) => {
    return query
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`);
  };
}

module.exports = new OwnerCommentModel();
