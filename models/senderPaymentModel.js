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
    `${SENDER_PAYMENTS_TABLE}.id`,
    `${SENDER_PAYMENTS_TABLE}.money`,
    `${SENDER_PAYMENTS_TABLE}.user_id as payerId`,
    `${SENDER_PAYMENTS_TABLE}.order_id as orderId`,
    `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.name as payerName`,
    `${USERS_TABLE}.email as payerEmail`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${SENDER_PAYMENTS_TABLE}.paypal_sender_id as paypalSenderId`,
    `${SENDER_PAYMENTS_TABLE}.paypal_order_id as paypalOrderId`,
    `${SENDER_PAYMENTS_TABLE}.paypal_capture_id as paypalCaptureId`,
    `${ORDERS_TABLE}.price_per_day as offerPricePerDay`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.end_date as offerEndDate`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.tenant_fee as tenantFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    `owners.name as ownerName`,
    `owners.id as ownerId`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`, `owners.name`];

  strFullFilterFields = [...this.strFilterFields, `${USERS_TABLE}.name`];

  orderFields = [
    `${SENDER_PAYMENTS_TABLE}.id`,
    `${SENDER_PAYMENTS_TABLE}.money`,
    `${SENDER_PAYMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `${LISTINGS_TABLE}.name`,
    `${SENDER_PAYMENTS_TABLE}.paypal_sender_id`,
    `${SENDER_PAYMENTS_TABLE}.paypal_order_id`,
    `owners.name`,
  ];

  create = async ({
    money,
    userId,
    orderId,
    paypalSenderId,
    paypalOrderId,
    paypalCaptureId,
  }) => {
    const res = await db(SENDER_PAYMENTS_TABLE)
      .insert({
        money,
        user_id: userId,
        order_id: orderId,
        paypal_sender_id: paypalSenderId,
        paypal_order_id: paypalOrderId,
        paypal_capture_id: paypalCaptureId,
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
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${SENDER_PAYMENTS_TABLE}.user_id`
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
      );

  totalCount = async (filter, timeInfos, userId = null) => {
    let query = db(SENDER_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      ...this.baseStrFilter(
        filter,
        userId ? this.strFilterFields : this.strFullFilterFields
      )
    );

    query = this.baseListTimeFilter(
      timeInfos,
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
    query = this.baseListJoin(query).whereRaw(
      ...this.baseStrFilter(
        filter,
        props.userId ? this.strFilterFields : this.strFullFilterFields
      )
    );

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    if (props.userId) {
      query = query.where({ user_id: props.userId });
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  getTotalPayed = async (userId) => {
    const resultSelect = await db(SENDER_PAYMENTS_TABLE)
      .select(db.raw("SUM(money) as sum"))
      .where({ user_id: userId })
      .first();
    return resultSelect.sum;
  };

  getFullById = async (id) => {
    let query = db(SENDER_PAYMENTS_TABLE);
    query = this.baseListJoin(query);

    const result = await query
      .where(`${SENDER_PAYMENTS_TABLE}.id`, id)
      .select([
        ...this.visibleFields,
        `${ORDERS_TABLE}.id as orderId`,
        `${ORDERS_TABLE}.status as orderStatus`,
        `${ORDERS_TABLE}.cancel_status as orderCancelStatus`,
        `${ORDERS_TABLE}.price_per_day as orderOfferPricePerDay`,
        `${ORDERS_TABLE}.start_date as orderOfferStartDate`,
        `${ORDERS_TABLE}.end_date as orderOfferEndDate`,
        `${ORDERS_TABLE}.tenant_fee as tenantFee`,
        `owners.id as ownerId`,
        `owners.name as ownerName`,
        `owners.email as ownerEmail`,
        `owners.photo as ownerPhoto`,
        `owners.phone as ownerPhone`,
        `${LISTINGS_TABLE}.id as listingId`,
        `${LISTINGS_TABLE}.name as listingName`,
        `${LISTINGS_TABLE}.city as listingCity`,
        `${LISTINGS_TABLE}.price_per_day as listingPricePerDay`,
        `${LISTINGS_TABLE}.min_rental_days as listingMinRentalDays`,
        `${LISTINGS_TABLE}.category_id as listingCategoryId`,
        `${LISTINGS_TABLE}.address as listingAddress`,
      ]);

    return result[0];
  };
}

module.exports = new SenderPayment();
