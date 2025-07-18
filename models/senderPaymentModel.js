require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const { formatDateToSQLFormat } = require("../utils");

const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const DISPUTES_TABLE = STATIC.TABLES.DISPUTES;
const CHAT_TABLE = STATIC.TABLES.CHATS;

class SenderPayment extends Model {
  visibleFields = [
    `${SENDER_PAYMENTS_TABLE}.id`,
    `${SENDER_PAYMENTS_TABLE}.money`,
    `${SENDER_PAYMENTS_TABLE}.user_id as payerId`,
    `${SENDER_PAYMENTS_TABLE}.order_id as orderId`,
    `${SENDER_PAYMENTS_TABLE}.admin_approved as adminApproved`,
    `${SENDER_PAYMENTS_TABLE}.payed_proof as payedProof`,
    `${SENDER_PAYMENTS_TABLE}.data`,
    `${SENDER_PAYMENTS_TABLE}.type`,
    `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
    `${SENDER_PAYMENTS_TABLE}.waiting_approved as waitingApproved`,
    `${SENDER_PAYMENTS_TABLE}.failed_description as failedDescription`,
    `${SENDER_PAYMENTS_TABLE}.due_at as dueAt`,
    `${USERS_TABLE}.name as payerName`,
    `${USERS_TABLE}.email as payerEmail`,
    `${USERS_TABLE}.phone as payerPhone`,
    `${USERS_TABLE}.photo as payerPhoto`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${ORDERS_TABLE}.renter_fee as renterFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    `${ORDERS_TABLE}.status as orderStatus`,
    `${ORDERS_TABLE}.cancel_status as orderCancelStatus`,
    `owners.name as ownerName`,
    `owners.email as ownerEmail`,
    `owners.id as ownerId`,
    `renters.name as renterName`,
    `renters.email as renterEmail`,
    `renters.id as renterId`,
    `${CHAT_TABLE}.id as chatId`,
    `${DISPUTES_TABLE}.id as disputeId`,
    `${DISPUTES_TABLE}.status as disputeStatus`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`, `owners.name`];

  strFullFilterFields = [...this.strFilterFields, `${USERS_TABLE}.name`];

  orderFields = [
    `${SENDER_PAYMENTS_TABLE}.id`,
    `${SENDER_PAYMENTS_TABLE}.money`,
    `${SENDER_PAYMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `${LISTINGS_TABLE}.name`,
    `owners.name`,
  ];

  create = async ({
    money,
    userId,
    orderId,
    data,
    payedProof,
    adminApproved,
    type,
    dueAt = null,
    waitingApproved,
    hidden = false,
  }) => {
    const res = await db(SENDER_PAYMENTS_TABLE)
      .insert({
        type,
        data,
        money,
        user_id: userId,
        order_id: orderId,
        payed_proof: payedProof,
        admin_approved: adminApproved,
        due_at: dueAt,
        waiting_approved: waitingApproved,
        hidden,
      })
      .returning("id");

    return res[0]["id"];
  };

  createByPaypal = ({
    money,
    userId,
    orderId,
    paypalSenderId = "",
    paypalOrderId,
    paypalCaptureId = "",
    payerCardLastDigits = "",
    payerCardLastBrand = "",
    proofUrl = "",
    type,
    hidden = false,
  }) => {
    if (
      ![STATIC.PAYMENT_TYPES.PAYPAL, STATIC.PAYMENT_TYPES.CREDIT_CARD].includes(
        type
      )
    ) {
      type = STATIC.PAYMENT_TYPES.PAYPAL;
    }

    return this.create({
      money,
      userId,
      orderId,
      type,
      payedProof: proofUrl,
      data: JSON.stringify({
        paypalSenderId,
        paypalCaptureId,
        paypalOrderId,
        payerCardLastDigits,
        payerCardLastBrand,
      }),
      adminApproved: false,
      dueAt: db.raw("CURRENT_TIMESTAMP"),
      waitingApproved: true,
      hidden,
    });
  };

  deleteUnactualByPaypal = async (orderId) => {
    await db(SENDER_PAYMENTS_TABLE)
      .where(`${SENDER_PAYMENTS_TABLE}.order_id`, orderId)
      .where(`${SENDER_PAYMENTS_TABLE}.waiting_approved`, "=", true)
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, true)
      .delete();
  };

  updateByPaypal = ({
    orderId,
    paypalSenderId,
    paypalOrderId,
    paypalCaptureId,
    payerCardLastDigits,
    payerCardLastBrand,
  }) => {
    return db(SENDER_PAYMENTS_TABLE)
      .where(`${SENDER_PAYMENTS_TABLE}.order_id`, "=", orderId)
      .where(`${SENDER_PAYMENTS_TABLE}.waiting_approved`, "=", true)
      .whereIn(`${SENDER_PAYMENTS_TABLE}.type`, [
        STATIC.PAYMENT_TYPES.CREDIT_CARD,
        STATIC.PAYMENT_TYPES.PAYPAL,
      ])
      .update({
        data: JSON.stringify({
          paypalSenderId,
          paypalCaptureId,
          paypalOrderId,
          payerCardLastDigits,
          payerCardLastBrand,
        }),
        waiting_approved: false,
        admin_approved: true,
        hidden: false,
      });
  };

  getPaymentInfoByPaypal = async (paymentOrderId) => {
    let query = db(SENDER_PAYMENTS_TABLE)
      .whereRaw(`${SENDER_PAYMENTS_TABLE}.data->>'paypalOrderId' = ?`, [
        paymentOrderId,
      ])
      .where(`${SENDER_PAYMENTS_TABLE}.waiting_approved`, "=", true)
      .whereIn(`${SENDER_PAYMENTS_TABLE}.type`, [
        STATIC.PAYMENT_TYPES.CREDIT_CARD,
        STATIC.PAYMENT_TYPES.PAYPAL,
      ]);

    query = this.baseListJoin(query);

    return await query.select(this.visibleFields).first();
  };

  getInfoAboutOrdersPayments = async (orderIds) => {
    const payments = await db(SENDER_PAYMENTS_TABLE)
      .select([
        `${SENDER_PAYMENTS_TABLE}.id`,
        `${SENDER_PAYMENTS_TABLE}.money`,
        `${SENDER_PAYMENTS_TABLE}.user_id as payerId`,
        `${SENDER_PAYMENTS_TABLE}.order_id as orderId`,
        `${SENDER_PAYMENTS_TABLE}.admin_approved as adminApproved`,
        `${SENDER_PAYMENTS_TABLE}.payed_proof as payedProof`,
        `${SENDER_PAYMENTS_TABLE}.data`,
        `${SENDER_PAYMENTS_TABLE}.type`,
        `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
        `${SENDER_PAYMENTS_TABLE}.waiting_approved as waitingApproved`,
        `${SENDER_PAYMENTS_TABLE}.failed_description as failedDescription`,
        `${SENDER_PAYMENTS_TABLE}.due_at as dueAt`,
      ])
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .whereIn("order_id", orderIds);

    const res = {};
    orderIds.forEach((orderId) => (res[orderId] = null));
    payments.forEach((payment) => (res[payment.orderId] = payment));

    return res;
  };

  getInfoAboutOrderPayment = async (orderId) => {
    const ordersInfo = await this.getInfoAboutOrdersPayments([orderId]);
    return ordersInfo[orderId];
  };

  createByBankTransfer = ({ money, userId, orderId, proofUrl }) =>
    this.create({
      money,
      userId,
      orderId,
      payedProof: proofUrl,
      data: JSON.stringify({}),
      adminApproved: false,
      type: STATIC.PAYMENT_TYPES.BANK_TRANSFER,
      waitingApproved: true,
    });

  checkCanCreditCardProofAppend = async (orderId) => {
    const result = await this.getInfoAboutOrderPayment(orderId);

    let canProof = true;

    if (!result) {
      canProof = false;
    } else {
      canProof =
        result.type === STATIC.PAYMENT_TYPES.BANK_TRANSFER && !adminApproved;
    }

    return canProof;
  };

  updateBankTransferTransactionProof = async (orderId, proof) => {
    await db(SENDER_PAYMENTS_TABLE)
      .where(`${SENDER_PAYMENTS_TABLE}.order_id`, "=", orderId)
      .where(
        `${SENDER_PAYMENTS_TABLE}.type`,
        "=",
        STATIC.PAYMENT_TYPES.BANK_TRANSFER
      )
      .update({
        payed_proof: proof,
        waiting_approved: true,
        created_at: db.raw("CURRENT_TIMESTAMP"),
      });
  };

  approveTransaction = async (orderId) => {
    await db(SENDER_PAYMENTS_TABLE)
      .where({ order_id: orderId })
      .update({
        admin_approved: true,
        waiting_approved: false,
        failed_description: null,
        due_at: db.raw("CURRENT_TIMESTAMP"),
      });
  };

  rejectTransaction = async (orderId, description) => {
    await db(SENDER_PAYMENTS_TABLE).where({ order_id: orderId }).update({
      admin_approved: false,
      waiting_approved: false,
      failed_description: description,
    });
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
      )
      .join(
        `${USERS_TABLE} as renters`,
        `renters.id`,
        "=",
        `${ORDERS_TABLE}.renter_id`
      )
      .leftJoin(
        `${DISPUTES_TABLE}`,
        `${DISPUTES_TABLE}.order_id`,
        "=",
        `${ORDERS_TABLE}.id`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_TABLE} ON (${CHAT_TABLE}.entity_type = '${STATIC.CHAT_TYPES.ORDER}' AND ${CHAT_TABLE}.entity_id = ${ORDERS_TABLE}.id)`
      );

  baseTypeWhere = (query, type) => {
    if (
      [
        STATIC.PAYMENT_TYPES.PAYPAL,
        STATIC.PAYMENT_TYPES.CREDIT_CARD,
        STATIC.PAYMENT_TYPES.BANK_TRANSFER,
      ].includes(type)
    ) {
      query = query.where(`${SENDER_PAYMENTS_TABLE}.type`, type);
    }
    return query;
  };

  baseStatusWhere = (query, status) => {
    if (status == "waiting") {
      query = query.where("waiting_approved", true);
    }

    if (status == "approved") {
      query = query
        .where("admin_approved", true)
        .where("waiting_approved", false);
    }

    if (status == "rejected") {
      query = query
        .where("admin_approved", false)
        .where("waiting_approved", false);
    }

    return query;
  };

  baseSenderTotalCount = async ({
    filter,
    timeInfos,
    dopWhere = null,
    select = null,
    type = null,
    status = null,
  }) => {
    if (!select) {
      select = this.strFilterFields;
    }

    let query = db(SENDER_PAYMENTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${SENDER_PAYMENTS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    if (dopWhere) {
      query = dopWhere(query);
    }

    query = this.baseTypeWhere(query, type);
    query = this.baseStatusWhere(query, status);

    const result = await query
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .count("* as count")
      .first();
    return +result?.count;
  };

  baseSenderList = async ({ props, dopWhere = null, select = null }) => {
    const { filter, start, count, type = null, status = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    if (!select) {
      select = this.strFilterFields;
    }

    let query = db(SENDER_PAYMENTS_TABLE).select(this.visibleFields);

    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${SENDER_PAYMENTS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    if (dopWhere) {
      query = dopWhere(query);
    }

    query = this.baseTypeWhere(query, type);
    query = this.baseStatusWhere(query, status);

    return await query
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  totalCount = async ({
    filter,
    type,
    timeInfos,
    userId = null,
    status = null,
  }) => {
    const select = userId ? this.strFilterFields : this.strFullFilterFields;
    const dopWhere = (query) => {
      if (userId) {
        query = query.where({ user_id: userId });
      }

      return query;
    };

    return await this.baseSenderTotalCount({
      filter,
      timeInfos,
      dopWhere,
      select,
      type,
      status,
    });
  };

  list = async (props) => {
    const select = props.userId
      ? this.strFilterFields
      : this.strFullFilterFields;

    const dopWhere = (query) => {
      if (props.userId) {
        query = query.where({ user_id: props.userId });
      }

      return query;
    };

    return await this.baseSenderList({ props, select, dopWhere });
  };

  getTotalPayed = async (userId) => {
    const resultSelect = await db(SENDER_PAYMENTS_TABLE)
      .select(db.raw("SUM(money) as sum"))
      .where({ user_id: userId, admin_approved: true })
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .first();
    return resultSelect.sum ?? 0;
  };

  getInfoByOrderId = async (orderId) => {
    return await db(SENDER_PAYMENTS_TABLE)
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .select([
        `${SENDER_PAYMENTS_TABLE}.id`,
        `${SENDER_PAYMENTS_TABLE}.money`,
        `${SENDER_PAYMENTS_TABLE}.user_id as payerId`,
        `${SENDER_PAYMENTS_TABLE}.order_id as orderId`,
        `${SENDER_PAYMENTS_TABLE}.admin_approved as adminApproved`,
        `${SENDER_PAYMENTS_TABLE}.payed_proof as payedProof`,
        `${SENDER_PAYMENTS_TABLE}.data`,
        `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
        `${SENDER_PAYMENTS_TABLE}.waiting_approved as waitingApproved`,
        `${SENDER_PAYMENTS_TABLE}.failed_description as failedDescription`,
      ])
      .where({ order_id: orderId })
      .first();
  };

  getFullById = async (id) => {
    let query = db(SENDER_PAYMENTS_TABLE);
    query = this.baseListJoin(query);

    const result = await query
      .where(`${SENDER_PAYMENTS_TABLE}.id`, id)
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .select([
        ...this.visibleFields,
        `${ORDERS_TABLE}.id as orderId`,
        `${ORDERS_TABLE}.status as orderStatus`,
        `${ORDERS_TABLE}.cancel_status as orderCancelStatus`,
        `${ORDERS_TABLE}.renter_fee as renterFee`,
        `owners.id as ownerId`,
        `owners.name as ownerName`,
        `owners.email as ownerEmail`,
        `owners.photo as ownerPhoto`,
        `owners.phone as ownerPhone`,
        `${LISTINGS_TABLE}.id as listingId`,
        `${LISTINGS_TABLE}.name as listingName`,
        `${LISTINGS_TABLE}.city as listingCity`,
        `${LISTINGS_TABLE}.category_id as listingCategoryId`,
        `${LISTINGS_TABLE}.address as listingAddress`,
      ]);

    return result[0];
  };

  baseGetSendersByDuration = (dateStart, dateEnd) => {
    return db(SENDER_PAYMENTS_TABLE)
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${SENDER_PAYMENTS_TABLE}.order_id`
      )
      .whereIn("status", [
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .where("admin_approved", true)
      .where(
        `${SENDER_PAYMENTS_TABLE}.created_at`,
        ">=",
        formatDateToSQLFormat(dateStart)
      )
      .where(
        `${SENDER_PAYMENTS_TABLE}.created_at`,
        "<=",
        formatDateToSQLFormat(dateEnd)
      )
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .select([
        `${ORDERS_TABLE}.id as orderId`,
        `${SENDER_PAYMENTS_TABLE}.type as type`,
        `${SENDER_PAYMENTS_TABLE}.type as transactionId`,
        `${SENDER_PAYMENTS_TABLE}.created_at as createdAt`,
      ]);
  };

  getSendersByDuration = async (dateStart, dateEnd) => {
    return await this.baseGetSendersByDuration(dateStart, dateEnd);
  };

  getUserSendersByDuration = async (dateStart, dateEnd, userId) => {
    return await this.baseGetSendersByDuration(dateStart, dateEnd).where(
      `${SENDER_PAYMENTS_TABLE}.user_id`,
      userId
    );
  };

  getTransferTypesCount = async ({ filter, timeInfos, status }) => {
    let query = db(SENDER_PAYMENTS_TABLE);

    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${SENDER_PAYMENTS_TABLE}.created_at`
    );

    query = this.baseStatusWhere(query, status);
    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${SENDER_PAYMENTS_TABLE}.id`)
    );

    const result = await query
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE WHEN ${SENDER_PAYMENTS_TABLE}.type = '${STATIC.PAYMENT_TYPES.PAYPAL}' THEN 1 ELSE 0 END) AS "paypalCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${SENDER_PAYMENTS_TABLE}.type = '${STATIC.PAYMENT_TYPES.CREDIT_CARD}' THEN 1 ELSE 0 END) AS "creditCardCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${SENDER_PAYMENTS_TABLE}.type = '${STATIC.PAYMENT_TYPES.BANK_TRANSFER}' THEN 1 ELSE 0 END) AS "bankTransferCount"`
        )
      )
      .where(`${SENDER_PAYMENTS_TABLE}.hidden`, false)
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      paypalCount: result["paypalCount"] ?? 0,
      creditCardCount: result["creditCardCount"] ?? 0,
      bankTransferCount: result["bankTransferCount"] ?? 0,
    };
  };
}

module.exports = new SenderPayment();
