require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  getDaysDifference,
  listingListDateConverter,
  separateDate,
  formatDateToSQLFormat,
} = require("../utils");

const RECIPIENT_PAYMENTS_TABLE = STATIC.TABLES.RECIPIENT_PAYMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class RecipientPayment extends Model {
  visibleFields = [
    `${RECIPIENT_PAYMENTS_TABLE}.id`,
    "money",
    "planned_time as plannedTime",
    `${RECIPIENT_PAYMENTS_TABLE}.received_type as receivedType`,
    `${RECIPIENT_PAYMENTS_TABLE}.status as status`,
    `${RECIPIENT_PAYMENTS_TABLE}.user_id as recipientId`,
    `${RECIPIENT_PAYMENTS_TABLE}.paypal_id as paypalId`,
    `${RECIPIENT_PAYMENTS_TABLE}.order_id as orderId`,
    `${ORDERS_TABLE}.price_per_day as offerPricePerDay`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.end_date as offerEndDate`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.tenant_fee as tenantFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
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

  createRefundPayment = ({ money, userId, orderId, paypalId }) =>
    this.create({
      money,
      userId,
      orderId,
      plannedTime: separateDate(new Date()),
      receivedType: STATIC.RECIPIENT_TYPES.REFUND,
      status: STATIC.RECIPIENT_STATUSES.COMPLETED,
      paypalId,
    });

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

  timeFilterWrap = (query, timeInfos) => {
    if (timeInfos.serverFromTime) {
      query = query.where(
        this.baseStringStartFilterDateWrap(
          `${RECIPIENT_PAYMENTS_TABLE}.planned_time`
        ),
        ">=",
        formatDateToSQLFormat(timeInfos.serverFromTime)
      );
    }

    if (timeInfos.serverToTime) {
      query = query.where(
        this.baseStringEndFilterDateWrap(
          `${RECIPIENT_PAYMENTS_TABLE}.planned_time`
        ),
        "<=",
        formatDateToSQLFormat(timeInfos.serverToTime)
      );
    }

    return query;
  };

  totalCount = async (
    filter,
    timeInfos,
    { status = null, type = null, userId = null }
  ) => {
    let query = db(RECIPIENT_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      ...this.baseStrFilter(
        filter,
        userId ? this.strFilterFields : this.strFullFilterFields
      )
    );

    query = this.timeFilterWrap(query, timeInfos);

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

    query = this.timeFilterWrap(query, props.timeInfos);

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

  paymentPlanGeneration = async ({
    startDate,
    endDate,
    pricePerDay,
    userId,
    orderId,
    fee,
  }) => {
    const dateDuration = getDaysDifference(startDate, endDate);

    const paymentDays = {};

    if (dateDuration > STATIC.MONTH_DURATION) {
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      const monthEnds = [];
      let iteration = 0;

      while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const dateDuration =
          iteration === 0
            ? getDaysDifference(startDate, lastDay)
            : lastDay.getDate();

        const paymentDate = separateDate(lastDay);

        paymentDays[paymentDate] = +(
          (dateDuration * pricePerDay * (100 - fee)) /
          100
        ).toFixed(2);

        const nextMonth = currentDate.getMonth() + 1;
        currentDate.setMonth(nextMonth, 0);
        monthEnds.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
        iteration++;
      }
    } else {
      paymentDays[endDate] = +(
        (dateDuration * pricePerDay * (100 - fee)) /
        100
      ).toFixed(2);
    }

    const dataToInsert = [];

    Object.keys(paymentDays).forEach((date) => {
      dataToInsert.push({
        money: paymentDays[date],
        planned_time: date,
        received_type: STATIC.RECIPIENT_TYPES.RENTAL,
        status: STATIC.RECIPIENT_STATUSES.WAITING,
        failed_details: "",
        user_id: userId,
        order_id: orderId,
      });
    });

    if (dataToInsert.length > 0) {
      await db.batchInsert(RECIPIENT_PAYMENTS_TABLE, dataToInsert);
    }

    return paymentDays;
  };

  getToPaymentsPay = async (
    limit = STATIC.INFINITY_SELECT_ITERATION_LIMIT,
    start = 0
  ) => {
    const currentDate = separateDate(new Date());

    const res = await db(RECIPIENT_PAYMENTS_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${RECIPIENT_PAYMENTS_TABLE}.user_id`
      )
      .where("status", STATIC.RECIPIENT_STATUSES.WAITING)
      .where("planned_time", "<=", currentDate)
      .limit(limit)
      .offset(start)
      .select([
        `${RECIPIENT_PAYMENTS_TABLE}.id`,
        `${RECIPIENT_PAYMENTS_TABLE}.money`,
        `${USERS_TABLE}.paypal_id as paypalId`,
      ]);

    return res;
  };

  markAsFailed = async (id, description) => {
    await db(RECIPIENT_PAYMENTS_TABLE).where("id", id).update({
      failed_details: description,
      status: STATIC.RECIPIENT_STATUSES.FAILED,
    });
  };

  markAsCompletedByIds = async (ids) => {
    await db(RECIPIENT_PAYMENTS_TABLE).whereIn("id", ids).update({
      status: STATIC.RECIPIENT_STATUSES.COMPLETED,
    });
  };

  getTotalGet = async (userId) => {
    const resultSelect = await db(RECIPIENT_PAYMENTS_TABLE)
      .select(db.raw("SUM(money) as sum"))
      .where({ user_id: userId })
      .first();
    return resultSelect.sum;
  };

  markRentalAsCancelledByOrderId = async (orderId) => {
    const query = db(RECIPIENT_PAYMENTS_TABLE)
      .where("order_id", orderId)
      .where("status", STATIC.RECIPIENT_STATUSES.WAITING)
      .where("received_type", STATIC.RECIPIENT_TYPES.RENTAL);

    let sum = 0;

    const lasActivePayment = await query.first();

    if (lasActivePayment) {
      const cancelledPayments = await query.where(
        "id",
        ">",
        lasActivePayment.id
      );

      await query.where("id", ">", lasActivePayment.id).update({
        status: STATIC.RECIPIENT_STATUSES.CANCELLED,
      });

      cancelledPayments.forEach((payment) => (sum += payment.money));
    }

    return sum;
  };
}

module.exports = new RecipientPayment();
