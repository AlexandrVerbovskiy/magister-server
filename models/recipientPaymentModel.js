require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const RECIPIENT_PAYMENTS_TABLE = STATIC.TABLES.RECIPIENT_PAYMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;

class RecipientPayment extends Model {
  visibleFields = [
    `${RECIPIENT_PAYMENTS_TABLE}.id`,
    "money",
    "planned_time as plannedTime",
    "received_type as receivedType",
    `${RECIPIENT_PAYMENTS_TABLE}.status as status`,
    `${RECIPIENT_PAYMENTS_TABLE}.user_id as recipientId`,
    `${RECIPIENT_PAYMENTS_TABLE}.paypal_id as paypalId`,
    `${RECIPIENT_PAYMENTS_TABLE}.order_id as orderId`,
    "last_tried_at as lastTriedAt",
    `${RECIPIENT_PAYMENTS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.name as recipientName`,
    `${USERS_TABLE}.email as recipientEmail`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `owners.name as ownerName`,
    `owners.id as ownerId`,
    `tenants.name as tenantName`,
    `tenants.id as tenantId`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`];

  strFullFilterFields = [
    ...this.strFilterFields,
    `${USERS_TABLE}.name`,
    `owners.name`,
    `tenants.name`,
  ];

  orderFields = [
    `${RECIPIENT_PAYMENTS_TABLE}.id`,
    "money",
    "planned_time",
    `${RECIPIENT_PAYMENTS_TABLE}.paypal_id`,
    "last_tried_at",
    `${RECIPIENT_PAYMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `${LISTINGS_TABLE}.title`,
  ];

  create = async ({
    money,
    userId,
    orderId,
    plannedTime,
    receivedType,
    status,
    paypalId,
  }) => {
    const res = await db(RECIPIENT_PAYMENTS_TABLE)
      .insert({
        money,
        planned_time: plannedTime,
        received_type: receivedType,
        status: status,
        paypal_id: paypalId,
        failed_details: "",
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
        `${RECIPIENT_PAYMENTS_TABLE}.order_id`
      )
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${RECIPIENT_PAYMENTS_TABLE}.user_id`
      )
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(
        `${USERS_TABLE} as owners`,
        `owners.id`,
        "=",
        `${LISTINGS_TABLE}.owner_id`
      )
      .join(
        `${USERS_TABLE} as tenants`,
        `tenants.id`,
        "=",
        `${ORDERS_TABLE}.tenant_id`
      );

  baseListStatusSelect = (query, status) => {
    if (
      [
        STATIC.RECIPIENT_STATUSES.COMPLETED,
        STATIC.RECIPIENT_STATUSES.FAILED,
        STATIC.RECIPIENT_STATUSES.WAITING,
        STATIC.RECIPIENT_STATUSES.CANCELLED,
      ].includes(status)
    ) {
      query.where(`${RECIPIENT_PAYMENTS_TABLE}.status`, status);
    }

    return query;
  };

  baseListTypeSelect = (query, type) => {
    if (
      [STATIC.RECIPIENT_TYPES.REFUND, STATIC.RECIPIENT_TYPES.RENTAL].includes(
        type
      )
    ) {
      query.where(`${RECIPIENT_PAYMENTS_TABLE}.received_type`, type);
    }

    return query;
  };

  totalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    { status = null, type = null, userId = null }
  ) => {
    let query = db(RECIPIENT_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      ...this.baseStrFilter(
        filter,
        userId ? this.strFilterFields : this.strFullFilterFields
      )
    );

    query = this.baseListTimeFilter(
      { serverFromTime, serverToTime },
      query,
      `${RECIPIENT_PAYMENTS_TABLE}.planned_time`
    );

    if (userId) {
      query = query.where({ user_id: userId });
    }

    if (status) {
      query = this.baseListStatusSelect(query, status);
    }

    if (type) {
      query = this.baseListTypeSelect(query, type);
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(RECIPIENT_PAYMENTS_TABLE).select(this.visibleFields);
    query = this.baseListJoin(query).whereRaw(
      ...this.baseStrFilter(
        filter,
        props.userId ? this.strFilterFields : this.strFullFilterFields
      )
    );

    query = this.baseListTimeFilter(
      props,
      query,
      `${RECIPIENT_PAYMENTS_TABLE}.planned_time`
    );

    if (props.userId) {
      query = query.where({ user_id: props.userId });
    }

    if (props.status) {
      query = this.baseListStatusSelect(query, props.status);
    }

    if (props.type) {
      query = this.baseListTypeSelect(query, props.type);
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };
}

module.exports = new RecipientPayment();
