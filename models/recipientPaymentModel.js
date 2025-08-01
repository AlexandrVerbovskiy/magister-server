require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  separateDate,
  formatDateToSQLFormat,
  getFactOrderDays,
} = require("../utils");

const RECIPIENT_PAYMENTS_TABLE = STATIC.TABLES.RECIPIENT_PAYMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;

class RecipientPayment extends Model {
  visibleFields = [
    `${RECIPIENT_PAYMENTS_TABLE}.id`,
    "money",
    "planned_time as plannedTime",
    `${RECIPIENT_PAYMENTS_TABLE}.received_type as receivedType`,
    `${RECIPIENT_PAYMENTS_TABLE}.status as status`,
    `${RECIPIENT_PAYMENTS_TABLE}.user_id as recipientId`,
    `${RECIPIENT_PAYMENTS_TABLE}.order_id as orderId`,
    `${ORDERS_TABLE}.status as orderStatus`,
    `${ORDERS_TABLE}.renter_fee as renterFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    "last_tried_at as lastTriedAt",
    `${RECIPIENT_PAYMENTS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.name as recipientName`,
    `${USERS_TABLE}.email as recipientEmail`,
    `${USERS_TABLE}.phone as recipientPhone`,
    `${USERS_TABLE}.photo as recipientPhoto`,
    `${USERS_TABLE}.paypal_id as recipientPaypalId`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `owners.id as ownerId`,
    `owners.name as ownerName`,
    `owners.email as ownerEmail`,
    `owners.phone as ownerPhone`,
    `owners.photo as ownerPhoto`,
    `renters.id as renterId`,
    `renters.name as renterName`,
    `renters.email as renterEmail`,
    `renters.phone as renterPhone`,
    `renters.photo as renterPhoto`,
    `${RECIPIENT_PAYMENTS_TABLE}.type as type`,
    `${RECIPIENT_PAYMENTS_TABLE}.data as data`,
    `${RECIPIENT_PAYMENTS_TABLE}.failed_description as failedDescription`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`];

  strFullFilterFields = [
    ...this.strFilterFields,
    `${USERS_TABLE}.name`,
    `owners.name`,
    `renters.name`,
  ];

  orderFields = [
    `${RECIPIENT_PAYMENTS_TABLE}.id`,
    "money",
    "planned_time",
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
    type,
    data = {},
    failedDescription = null,
  }) => {
    const res = await db(RECIPIENT_PAYMENTS_TABLE)
      .insert({
        type,
        money,
        planned_time: plannedTime,
        received_type: receivedType,
        status: status,
        data: JSON.stringify(data),
        failed_details: "",
        user_id: userId,
        order_id: orderId,
        failed_description: failedDescription,
      })
      .returning("id");

    return res[0]["id"];
  };

  createRefundPayment = ({
    money,
    userId,
    orderId,
    data,
    type,
    status,
    failedDescription = null,
  }) =>
    this.create({
      data,
      money,
      userId,
      orderId,
      type,
      status,
      plannedTime: separateDate(new Date()),
      receivedType: STATIC.RECIPIENT_TYPES.REFUND,
      failedDescription,
    });

  updateRefundPayment = async ({
    id,
    type,
    data,
    status,
    failedDescription = null,
  }) => {
    await db(RECIPIENT_PAYMENTS_TABLE)
      .where({
        id,
        received_type: STATIC.RECIPIENT_TYPES.REFUND,
        status: STATIC.RECIPIENT_STATUSES.FAILED,
      })
      .update({
        type,
        data: JSON.stringify(data),
        status,
        failed_description: failedDescription,
      });
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
        `${USERS_TABLE} as renters`,
        `renters.id`,
        "=",
        `${ORDERS_TABLE}.renter_id`
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

  baseListReceivedTypeSelect = (query, receivedType) => {
    if (
      [STATIC.RECIPIENT_TYPES.REFUND, STATIC.RECIPIENT_TYPES.RECIPIENT].includes(
        receivedType
      )
    ) {
      query.where(`${RECIPIENT_PAYMENTS_TABLE}.received_type`, receivedType);
    }

    return query;
  };

  baseListTypeSelect = (query, type) => {
    if (
      [
        STATIC.PAYMENT_TYPES.PAYPAL,
        STATIC.PAYMENT_TYPES.CREDIT_CARD,
        STATIC.PAYMENT_TYPES.BANK_TRANSFER,
      ].includes(type)
    ) {
      query.where(`${RECIPIENT_PAYMENTS_TABLE}.type`, type);
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
    { status = null, receivedType = null, userId = null, type = null }
  ) => {
    let query = db(RECIPIENT_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${RECIPIENT_PAYMENTS_TABLE}.id`)
    );

    query = this.timeFilterWrap(query, timeInfos);

    if (userId) {
      query = query.where({ user_id: userId });
    }

    if (status) {
      query = this.baseListStatusSelect(query, status);
    }

    if (receivedType) {
      query = this.baseListReceivedTypeSelect(query, receivedType);
    }

    if (type) {
      query = this.baseListTypeSelect(query, type);
    }

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(RECIPIENT_PAYMENTS_TABLE).select(this.visibleFields);

    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${RECIPIENT_PAYMENTS_TABLE}.id`)
    );

    query = this.timeFilterWrap(query, props.timeInfos);

    if (props.userId) {
      query = query.where({ user_id: props.userId });
    }

    if (props.status) {
      query = this.baseListStatusSelect(query, props.status);
    }

    if (props.receivedType) {
      query = this.baseListReceivedTypeSelect(query, props.receivedType);
    }

    if (props.type) {
      query = this.baseListTypeSelect(query, props.type);
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  paypalPaymentPlanGeneration = async ({
    startDate,
    finishDate,
    pricePerDay,
    userId,
    orderId,
    fee,
  }) => {
    const dateDuration = getFactOrderDays(startDate, finishDate);

    const paymentDays = {};

    paymentDays[finishDate] = +(
      (dateDuration * pricePerDay * (100 - fee)) /
      100
    ).toFixed(2);

    /*if (dateDuration > STATIC.MONTH_DURATION) {
      let currentDate = new Date(startDate);
      const end = new Date(finishDate);
      const monthEnds = [];
      let iteration = 0;

      while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const dateDuration =
          iteration === 0
            ? getFactOrderDays(startDate, lastDay)
            : lastDay.getDate();

        let paymentDate = separateDate(lastDay);

        ----
        if (paymentDate > finishDate) {
          paymentDate = finishDate;
        }
        ----

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
      paymentDays[finishDate] = +(
        (dateDuration * pricePerDay * (100 - fee)) /
        100
      ).toFixed(2);
    }*/

    const dataToInsert = [];

    Object.keys(paymentDays).forEach((date) => {
      dataToInsert.push({
        money: paymentDays[date],
        planned_time: date,
        received_type: STATIC.RECIPIENT_TYPES.RECIPIENT,
        status: STATIC.RECIPIENT_STATUSES.WAITING,
        failed_details: "",
        user_id: userId,
        order_id: orderId,
        type: STATIC.PAYMENT_TYPES.PAYPAL,
        data: JSON.stringify({ paypalId: "-" }),
      });
    });

    if (dataToInsert.length > 0) {
      await db.batchInsert(RECIPIENT_PAYMENTS_TABLE, dataToInsert);
    }

    return paymentDays;
  };

  baseFullWaitingPaypalSelectQuery = () => {
    return db(RECIPIENT_PAYMENTS_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${RECIPIENT_PAYMENTS_TABLE}.user_id`
      )
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${RECIPIENT_PAYMENTS_TABLE}.order_id`
      )
      .where(
        `${RECIPIENT_PAYMENTS_TABLE}.status`,
        STATIC.RECIPIENT_STATUSES.WAITING
      )
      .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
      .where(`${RECIPIENT_PAYMENTS_TABLE}.type`, STATIC.PAYMENT_TYPES.PAYPAL)
      .select([
        `${RECIPIENT_PAYMENTS_TABLE}.id`,
        `${RECIPIENT_PAYMENTS_TABLE}.money`,
        `${RECIPIENT_PAYMENTS_TABLE}.data`,
        `${USERS_TABLE}.paypal_id as paypalId`,
      ]);
  };

  getToPaymentsPay = async (
    limit = STATIC.INFINITY_SELECT_ITERATION_LIMIT,
    start = 0
  ) => {
    const currentDate = separateDate(new Date());

    const res = await this.baseFullWaitingPaypalSelectQuery()
      .where("planned_time", "<=", currentDate)
      .where("planned_time", "<=", currentDate)
      .limit(limit)
      .offset(start);

    return res;
  };

  markAsFailed = async (id, data, description) => {
    await db(RECIPIENT_PAYMENTS_TABLE)
      .where("id", id)
      .update({
        failed_details: description,
        data: JSON.stringify(data),
        status: STATIC.RECIPIENT_STATUSES.FAILED,
      });
  };

  markAsCompletedById = async (id, data) => {
    await db(RECIPIENT_PAYMENTS_TABLE)
      .where("id", id)
      .update({
        status: STATIC.RECIPIENT_STATUSES.COMPLETED,
        data: JSON.stringify(data),
      });
  };

  getTotalGet = async (userId) => {
    const resultSelect = await db(RECIPIENT_PAYMENTS_TABLE)
      .select(db.raw("SUM(money) as sum"))
      .where({ user_id: userId, status: STATIC.RECIPIENT_STATUSES.COMPLETED })
      .first();
    return resultSelect.sum ?? 0;
  };

  markRentalAsCancelledByOrderId = async (orderId) => {
    const query = db(RECIPIENT_PAYMENTS_TABLE)
      .where("order_id", orderId)
      .where("status", STATIC.RECIPIENT_STATUSES.WAITING)
      .where("received_type", STATIC.RECIPIENT_TYPES.RECIPIENT);

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

  baseWaitingRefund = (query) => {
    query = query.where(
      `${RECIPIENT_PAYMENTS_TABLE}.status`,
      STATIC.RECIPIENT_STATUSES.WAITING
    );
    query = query.where(
      `${RECIPIENT_PAYMENTS_TABLE}.received_type`,
      STATIC.RECIPIENT_TYPES.REFUND
    );
    query = query.where(
      `${RECIPIENT_PAYMENTS_TABLE}.type`,
      STATIC.PAYMENT_TYPES.BANK_TRANSFER
    );
    return query;
  };

  complete = async (id, type, paypalId, cardNumber) => {
    let data = {};

    if (type == STATIC.PAYMENT_TYPES.BANK_TRANSFER) {
      data = { cardNumber: cardNumber };
    }

    if (type == STATIC.PAYMENT_TYPES.PAYPAL) {
      data = { paypalId: paypalId };
    }

    await db(RECIPIENT_PAYMENTS_TABLE)
      .where({ id: id })
      .update({
        status: STATIC.RECIPIENT_STATUSES.COMPLETED,
        failed_description: null,
        data: JSON.stringify(data),
        type: type,
      });
  };

  reject = async (id, description) => {
    await db(RECIPIENT_PAYMENTS_TABLE)
      .where({ id: id, status: STATIC.RECIPIENT_STATUSES.WAITING })
      .update({
        status: STATIC.RECIPIENT_STATUSES.FAILED,
        failed_description: description,
      });
  };

  markFailedAsDone = async (id, paymentNumber) => {
    await db(RECIPIENT_PAYMENTS_TABLE)
      .where({ id: id, status: STATIC.RECIPIENT_STATUSES.FAILED })
      .update({
        status: STATIC.RECIPIENT_STATUSES.COMPLETED,
        data: JSON.stringify({ paypalId: paymentNumber }),
      });
  };

  getById = async (id) => {
    let query = db(RECIPIENT_PAYMENTS_TABLE);
    query = this.baseListJoin(query);
    query = query.where(`${RECIPIENT_PAYMENTS_TABLE}.id`, id);
    return await query.select(this.visibleFields).first();
  };

  getFullById = async (id) => {
    return await this.baseFullWaitingPaypalSelectQuery()
      .where(`${RECIPIENT_PAYMENTS_TABLE}.id`, id)
      .first();
  };
}

module.exports = new RecipientPayment();
