require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;

class SenderPayment extends Model {
  visibleFields = [
    "id",
    "money",
    `${SENDER_PAYMENTS_TABLE}.user_id as userId`,
    "order_id as orderId",
    `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.name`,
    `${USERS_TABLE}.email`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.title`,
  ];

  strFilterFields = ["money", `${USERS_TABLE}.name`, `${LISTINGS_TABLE}.title`];

  orderFields = [
    `${SENDER_PAYMENTS_TABLE}.id`,
    "money",
    `${SENDER_PAYMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `${LISTINGS_TABLE}.title`,
  ];

  create = async ({ money, userId, orderId }) => {
    const res = await db(SENDER_PAYMENTS_TABLE)
      .insert({
        money,
        user_id: userId,
        order_id: orderId,
      })
      .returning("id");

    return res[0]["id"];
  };

  baseListJoin = (query) =>
    query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${SENDER_PAYMENTS_TABLE}.order_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.user_id`)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      );

  totalCount = async (filter, serverFromTime, serverToTime, userId = null) => {
    let query = db(SENDER_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      { serverFromTime, serverToTime },
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    if (userId) {
      query = query.where({ user_id: userId });
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(SENDER_PAYMENTS_TABLE).select(this.visibleFields);
    query = this.baseListJoin(query).whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      props,
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    if (props.userId) {
      query = query.where({ user_id: props.userId });
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };
}

module.exports = new SenderPayment();
