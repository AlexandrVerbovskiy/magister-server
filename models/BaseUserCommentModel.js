require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const BaseCommentModel = require("./BaseCommentModel");

const USER_COMMENTS_TABLE = STATIC.TABLES.USER_COMMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;

class BaseUserCommentModel extends BaseCommentModel {
  table = USER_COMMENTS_TABLE;

  keyFieldName = `userId`;

  pointFields = [
    `quality`,
    `listingAccuracy`,
    `utility`,
    `condition`,
    `performance`,
    `location`,
  ];

  visibleFields = [
    `${USER_COMMENTS_TABLE}.id`,
    `${USER_COMMENTS_TABLE}.description`,
    `${USER_COMMENTS_TABLE}.type`,
    `${USER_COMMENTS_TABLE}.quality`,
    `${USER_COMMENTS_TABLE}.listing_accuracy as listingAccuracy`,
    `${USER_COMMENTS_TABLE}.utility`,
    `${USER_COMMENTS_TABLE}.condition`,
    `${USER_COMMENTS_TABLE}.performance`,
    `${USER_COMMENTS_TABLE}.location`,
    `${USER_COMMENTS_TABLE}.approved`,
    `${USER_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${USER_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${USER_COMMENTS_TABLE}.created_at as createdAt`,
    `${USER_COMMENTS_TABLE}.order_id as orderId`,
    `reviewers.id as reviewerId`,
    `reviewers.name as reviewerName`,
    `reviewers.email as reviewerEmail`,
    `reviewers.phone as reviewerPhone`,
    `reviewers.photo as reviewerPhoto`,
    `${USERS_TABLE}.id as userId`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.email as userEmail`,
    `${USERS_TABLE}.phone as userPhone`,
    `${USERS_TABLE}.photo as userPhoto`,
  ];

  strFilterFields = [`${USERS_TABLE}.name`, `reviewers.name`];

  orderFields = [
    `${USER_COMMENTS_TABLE}.id`,
    `${USER_COMMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseJoin = (query) => {
    return query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${USER_COMMENTS_TABLE}.order_id`
      )
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", this.keyField)
      .join(
        `${USERS_TABLE} as reviewers`,
        `reviewers.id`,
        "=",
        this.reviewerIdField
      );
  };

  baseSelect = () => {
    let query = db(USER_COMMENTS_TABLE);
    query = this.baseJoin(query);
    query = query.where(`${USER_COMMENTS_TABLE}.type`, this.type);
    return query;
  };

  create = async ({
    description,
    quality,
    listingAccuracy,
    utility,
    condition,
    performance,
    location,
    orderId,
  }) => {
    const res = await db(USER_COMMENTS_TABLE)
      .insert({
        description,

        quality,
        listing_accuracy: listingAccuracy,
        utility,
        condition,
        performance,
        location,

        order_id: orderId,
        rejected_description: "",
        type: this.type,
      })
      .returning("id");

    return res[0]["id"];
  };
}

module.exports = BaseUserCommentModel;
