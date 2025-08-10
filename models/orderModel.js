require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  formatDateToSQLFormat,
  separateDate,
  generateDatesBetween,
} = require("../utils");
const listingModel = require("./listingModel");
const listingCategoryModel = require("./listingCategoryModel");

const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const TEMP_ORDERS_TABLE = STATIC.TABLES.TEMP_ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;
const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;
const OWNER_COMMENTS_TABLE = STATIC.TABLES.OWNER_COMMENTS;
const RENTER_COMMENTS_TABLE = STATIC.TABLES.RENTER_COMMENTS;
const DISPUTES_TABLE = STATIC.TABLES.DISPUTES;
const CHAT_TABLE = STATIC.TABLES.CHATS;
const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;

class OrderModel extends Model {
  lightVisibleFields = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.status`,
    `${ORDERS_TABLE}.cancel_status as cancelStatus`,
    `${ORDERS_TABLE}.renter_fee as renterFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    `${ORDERS_TABLE}.finished_at as offerFinishedAt`,
    `${ORDERS_TABLE}.price as offerPrice`,
    `${ORDERS_TABLE}.finish_time as offerFinishDate`,
    `${ORDERS_TABLE}.start_time as offerStartDate`,
    `${ORDERS_TABLE}.dispute_probability as disputeProbability`,
    `renters.id as renterId`,
    `renters.name as renterName`,
    `renters.email as renterEmail`,
    `renters.photo as renterPhoto`,
    `renters.phone as renterPhone`,
    `renters.verified as renterVerified`,
    `renters.paypal_id as renterPaypalId`,
    `owners.id as ownerId`,
    `owners.name as ownerName`,
    `owners.email as ownerEmail`,
    `owners.photo as ownerPhoto`,
    `owners.phone as ownerPhone`,
    `owners.verified as ownerVerified`,
    `owners.paypal_id as ownerPaypalId`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTINGS_TABLE}.other_category as listingOtherCategory`,
    `${LISTINGS_TABLE}.price as listingPrice`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
    `${DISPUTES_TABLE}.id as disputeId`,
    `${DISPUTES_TABLE}.status as disputeStatus`,
    `${DISPUTES_TABLE}.type as disputeType`,
    `${DISPUTES_TABLE}.description as disputeDescription`,
    `${CHAT_TABLE}.id as chatId`,
  ];

  requestVisibleFields = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id as requestId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price as newPrice`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_time as newStartDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time as newFinishDate`,
  ];

  fullVisibleFields = [
    ...this.lightVisibleFields,
    `${LISTINGS_TABLE}.description as listingDescription`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.postcode as listingPostcode`,
    `${LISTINGS_TABLE}.lat as listingRentalLat`,
    `${LISTINGS_TABLE}.lng as listingRentalLng`,
    `${LISTINGS_TABLE}.radius as listingRentalRadius`,
    `renters.phone as renterPhone`,
    `owners.phone as ownerPhone`,
    `owners.facebook_url as ownerFacebookUrl`,
    `owners.linkedin_url as ownerLinkedinUrl`,
    `owners.instagram_url as ownerInstagramUrl`,
    `renters.facebook_url as renterFacebookUrl`,
    `renters.linkedin_url as renterLinkedinUrl`,
    `renters.instagram_url as renterInstagramUrl`,
  ];

  selectPartPayedInfo = [
    `${SENDER_PAYMENTS_TABLE}.id as payedId`,
    `${SENDER_PAYMENTS_TABLE}.failed_description as payedFailedDescription`,
    `${SENDER_PAYMENTS_TABLE}.waiting_approved as payedWaitingApproved`,
    `${SENDER_PAYMENTS_TABLE}.admin_approved as payedAdminApproved`,
    `${SENDER_PAYMENTS_TABLE}.type as payedType`,
  ];

  fullGroupBy = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.status`,
    `${ORDERS_TABLE}.cancel_status`,
    `${ORDERS_TABLE}.renter_fee`,
    `${ORDERS_TABLE}.owner_fee`,
    `${ORDERS_TABLE}.price`,
    `${ORDERS_TABLE}.start_time`,
    `${ORDERS_TABLE}.finish_time`,
    `renters.id`,
    `renters.name`,
    `renters.email`,
    `renters.photo`,
    `renters.phone`,
    `owners.id`,
    `owners.name`,
    `owners.email`,
    `owners.photo`,
    `owners.phone`,
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.category_id`,
    `${LISTINGS_TABLE}.other_category`,
    `${LISTINGS_TABLE}.price`,
    `${LISTINGS_TABLE}.start_time`,
    `${LISTINGS_TABLE}.finish_time`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    `${LISTINGS_TABLE}.description`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.postcode`,
    `${LISTINGS_TABLE}.lat`,
    `${LISTINGS_TABLE}.lng`,
    `${LISTINGS_TABLE}.radius`,
    `renters.phone`,
    `owners.phone`,
    `owners.facebook_url`,
    `owners.linkedin_url`,
    `owners.instagram_url`,
    `renters.facebook_url`,
    `renters.linkedin_url`,
    `renters.instagram_url`,
    `${DISPUTES_TABLE}.id`,
    `${DISPUTES_TABLE}.status`,
    `${DISPUTES_TABLE}.type`,
    `${DISPUTES_TABLE}.description`,
    `${CHAT_TABLE}.id`,
  ];

  requestGroupBy = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_time`,
  ];

  strFilterFields = [
    `renters.name`,
    `renters.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForRenters = [
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForOwners = [
    `renters.name`,
    `renters.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  orderFields = [
    `${ORDERS_TABLE}.id`,
    `renters.name`,
    `renters.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  processStatuses = [
    STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
    STATIC.ORDER_STATUSES.PENDING_RENTER,
    STATIC.ORDER_STATUSES.PENDING_OWNER,
    STATIC.ORDER_STATUSES.IN_PROCESS,
    STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
  ];

  canFastCancelPayedOrder = (order) => {
    if (
      ![
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
      ].includes(order.status)
    ) {
      return false;
    }

    const today = new Date();
    const offerStartDate = order.offerStartDate;

    let quickCancelLastPossible = new Date(offerStartDate);
    quickCancelLastPossible.setDate(quickCancelLastPossible.getDate() - 2);

    return today <= quickCancelLastPossible;
  };

  canFinalizationOrder = (order) => {
    const today = new Date();
    const offerFinishDate = order.offerFinishDate;

    let quickCancelLastPossible = new Date(offerFinishDate);
    return today > quickCancelLastPossible;
  };

  orderListingJoin = (query, orderTable = ORDERS_TABLE) => {
    return query
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${orderTable}.listing_id`
      )
      .leftJoin(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      );
  };

  orderDisputeJoin = (query, orderTable = ORDERS_TABLE) => {
    return query.leftJoin(
      `${DISPUTES_TABLE}`,
      `${DISPUTES_TABLE}.order_id`,
      "=",
      `${orderTable}.id`
    );
  };

  orderUsersJoin = (
    query,
    orderTable = ORDERS_TABLE,
    listingTable = LISTINGS_TABLE
  ) => {
    return query
      .join(
        `${USERS_TABLE} as owners`,
        `owners.id`,
        "=",
        `${listingTable}.owner_id`
      )
      .join(
        `${USERS_TABLE} as renters`,
        `renters.id`,
        "=",
        `${orderTable}.renter_id`
      );
  };

  fullOrdersJoin = (query) => {
    query = this.orderListingJoin(query);
    query = this.orderUsersJoin(query);
    query = this.orderDisputeJoin(query);

    query = query.joinRaw(
      `LEFT JOIN ${CHAT_TABLE} ON (${CHAT_TABLE}.entity_type = '${STATIC.CHAT_TYPES.ORDER}' AND ${CHAT_TABLE}.entity_id = ${ORDERS_TABLE}.id)`
    );

    return query;
  };

  fullBaseGetQuery = (filter) => {
    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);

    return query.where((builder) => {
      builder
        .whereRaw(this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`))
        .orWhereRaw(...this.baseStrFilter(filter));
    });
  };

  orderCreatedTimeFilterWrap = (query, timeInfos) => {
    if (timeInfos.serverFromTime) {
      query = query.where(
        this.baseStringStartFilterDateWrap(`${ORDERS_TABLE}.created_at`),
        ">=",
        formatDateToSQLFormat(timeInfos.serverFromTime)
      );
    }

    if (timeInfos.serverToTime) {
      query = query.where(
        this.baseStringEndFilterDateWrap(`${ORDERS_TABLE}.created_at`),
        "<=",
        formatDateToSQLFormat(timeInfos.serverToTime)
      );
    }

    return query;
  };

  orderTimeFilterWrap = (query, timeInfos) => {
    if (timeInfos.serverFromTime) {
      query = query.where(
        this.baseStringStartFilterDateWrap(`${ORDERS_TABLE}.created_at`),
        ">=",
        formatDateToSQLFormat(timeInfos.serverFromTime)
      );
    }

    if (timeInfos.serverToTime) {
      query = query.where(
        this.baseStringEndFilterDateWrap(`${ORDERS_TABLE}.created_at`),
        "<=",
        formatDateToSQLFormat(timeInfos.serverToTime)
      );
    }

    return query;
  };

  baseRequestInfoJoin = (query) => {
    return query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );
  };

  fullBaseGetQueryWithRequestInfo = (filter) => {
    let query = this.fullBaseGetQuery(filter);
    return this.baseRequestInfoJoin(query);
  };

  payedInfoJoin = (query) => {
    return query.joinRaw(
      `LEFT JOIN ${SENDER_PAYMENTS_TABLE} ON
       (${SENDER_PAYMENTS_TABLE}.order_id = ${ORDERS_TABLE}.id AND ${SENDER_PAYMENTS_TABLE}.hidden = false)`
    );
  };

  disputeChatInfoJoin = (query, userId) => {
    return query
      .joinRaw(
        `LEFT JOIN ${CHAT_TABLE} as dispute_chats ON (dispute_chats.entity_id = ${DISPUTES_TABLE}.id AND dispute_chats.entity_type='${STATIC.CHAT_TYPES.DISPUTE}')`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_RELATION_TABLE} as dispute_chat_relations ON (dispute_chat_relations.user_id = ${userId} AND dispute_chats.id = dispute_chat_relations.chat_id)`
      )
      .whereRaw(
        `(dispute_chat_relations.user_id = ${userId} OR dispute_chats.id IS NULL)`
      );
  };

  commentsInfoJoin = (query) => {
    query = query.joinRaw(
      `LEFT JOIN ${RENTER_COMMENTS_TABLE} as "renter_comments" 
      ON renter_comments.order_id = ${ORDERS_TABLE}.id`
    );

    query = query.joinRaw(
      `LEFT JOIN ${OWNER_COMMENTS_TABLE} as "owner_comments" 
      ON owner_comments.order_id = ${ORDERS_TABLE}.id`
    );

    return query;
  };

  commentsVisibleFields = (visibleFields) => {
    return [
      ...visibleFields,

      `renter_comments.id as renterCommentId`,
      `owner_comments.id as ownerCommentId`,

      `renter_comments.waiting_admin as renterCommentWaitingAdmin`,
      `owner_comments.waiting_admin as ownerCommentWaitingAdmin`,

      `renter_comments.waiting_admin as renterCommentApproved`,
      `owner_comments.waiting_admin as ownerCommentApproved`,
    ];
  };

  disputeChatsVisibleFields = (visibleFields) => {
    return [...visibleFields, `dispute_chats.id as disputeChatId`];
  };

  renterBaseGetQuery = (filter, renterId) => {
    const baseGetReq = this.fullBaseGetQueryWithRequestInfo;
    let query = baseGetReq(filter);
    query = this.payedInfoJoin(query);
    return query.whereRaw("renters.id = ?", renterId);
  };

  ownerBaseGetQuery = (filter, ownerId) => {
    const baseGetReq = this.fullBaseGetQueryWithRequestInfo;
    let query = baseGetReq(filter);
    return query.whereRaw("owners.id = ?", ownerId);
  };

  baseQueryListByType = (query, type) => {
    if (type == "finished") {
      query = query
        .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
        .whereRaw(`${DISPUTES_TABLE}.id IS NULL`)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "rejected") {
      query = query
        .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.REJECTED)
        .whereRaw(`${DISPUTES_TABLE}.id IS NULL`)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "canceled") {
      query = query
        .where(function () {
          this.where(
            `${ORDERS_TABLE}.cancel_status`,
            STATIC.ORDER_CANCELATION_STATUSES.CANCELLED
          ).orWhere(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.REJECTED);
        })
        .whereRaw(`${DISPUTES_TABLE}.id IS NULL`);
    }

    if (type == "in-dispute") {
      query = query
        .whereNotNull(`${DISPUTES_TABLE}.id`)
        .whereNot(`${DISPUTES_TABLE}.status`, STATIC.DISPUTE_STATUSES.SOLVED);
    }

    if (type == "accepted") {
      query = query
        .where(
          `${ORDERS_TABLE}.status`,
          STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT
        )
        .whereRaw(`${DISPUTES_TABLE}.id IS NULL`)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "active") {
      query = query
        .whereNotIn(`${ORDERS_TABLE}.status`, [
          STATIC.ORDER_STATUSES.FINISHED,
          STATIC.ORDER_STATUSES.REJECTED,
        ])
        .whereNull(`${ORDERS_TABLE}.cancel_status`)
        .whereRaw(`${DISPUTES_TABLE}.id IS NULL`);
    }

    return query;
  };

  fullTotalCount = async (filter, timeInfos) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.fullBaseGetQuery(filter);
    query = this.orderTimeFilterWrap(query, timeInfos);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  fullList = async (props) => {
    const { filter, start, count, timeInfos } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQuery(filter);
    query = this.orderTimeFilterWrap(query, timeInfos);

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseRenterTotalCount = async (filter, renterId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.renterBaseGetQuery(filter, renterId);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  baseOwnerTotalCount = async (filter, ownerId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.ownerBaseGetQuery(filter, ownerId);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  baseRenterList = async (props) => {
    const { filter, start, count, renterId } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.renterBaseGetQuery(filter, renterId);
    query = this.commentsInfoJoin(query);
    query = this.disputeChatInfoJoin(query, renterId);

    let visibleFields = [
      ...this.lightVisibleFields,
      ...this.requestVisibleFields,
      ...this.selectPartPayedInfo,
    ];
    visibleFields = this.commentsVisibleFields(visibleFields);
    visibleFields = this.disputeChatsVisibleFields(visibleFields);

    return await query
      .select(visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseOwnerList = async (props) => {
    const { filter, start, count, ownerId } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.ownerBaseGetQuery(filter, ownerId);
    query = this.commentsInfoJoin(query);
    query = this.disputeChatInfoJoin(query, ownerId);

    let visibleFields = this.commentsVisibleFields([
      ...this.lightVisibleFields,
      ...this.requestVisibleFields,
    ]);
    visibleFields = this.disputeChatsVisibleFields(visibleFields);

    return await query
      .select(visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  renterOrdersTotalCount = async (filter, userId) => {
    return await this.baseRenterTotalCount(filter, userId);
  };

  renterOrdersList = async (props) => {
    return await this.baseRenterList(props);
  };

  ownerOrdersTotalCount = async (filter, userId) => {
    return await this.baseOwnerTotalCount(filter, userId);
  };

  ownerOrderList = async (props) => {
    return await this.baseOwnerList(props);
  };

  allOrdersTotalCount = async (filter, type, timeInfos) => {
    let query = this.fullBaseGetQuery(filter);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.baseQueryListByType(query, type);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  allOrderList = async (props) => {
    const { filter, start, count, timeInfos, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQuery(filter);
    query = this.payedInfoJoin(query);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.baseQueryListByType(query, type);

    return await query
      .select([...this.fullVisibleFields, ...this.selectPartPayedInfo])
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  create = async ({
    listingId,
    renterId,
    ownerFee,
    renterFee,
    price,
    finishDate,
    startDate,
    disputeProbability,
  }) => {
    const res = await db(ORDERS_TABLE)
      .insert({
        listing_id: listingId,
        renter_id: renterId,
        owner_fee: ownerFee,
        renter_fee: renterFee,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        price,
        finish_time: finishDate,
        start_time: startDate,
        dispute_probability: disputeProbability ?? 0,
      })
      .returning("id");

    return res[0]["id"];
  };

  createTemp = async ({
    listingId,
    renterId,
    ownerFee,
    renterFee,
    price,
    finishDate,
    startDate,
  }) => {
    const res = await db(TEMP_ORDERS_TABLE)
      .insert({
        listing_id: listingId,
        renter_id: renterId,
        owner_fee: ownerFee,
        renter_fee: renterFee,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        price,
        finish_time: finishDate,
        start_time: startDate,
      })
      .returning("id");

    return res[0]["id"];
  };

  checkTempExist = async (listingId, renterId) => {
    const query = db(TEMP_ORDERS_TABLE)
      .where("listing_id", listingId)
      .where("renter_id", renterId);

    return await query.first()?.id;
  };

  updateTemp = async ({
    tempOrderId,
    ownerFee,
    renterFee,
    price,
    finishDate,
    startDate,
  }) => {
    await db(TEMP_ORDERS_TABLE).where("id", tempOrderId).update({
      owner_fee: ownerFee,
      renter_fee: renterFee,
      price,
      finish_time: finishDate,
      start_time: startDate,
    });
  };

  getByWhere = async (key, value, needList = false) => {
    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);
    query = query.select(this.fullVisibleFields).where(key, value);

    if (needList) {
      return await query;
    } else {
      return await query.first();
    }
  };

  getByWhereWithDisputeChat = async (key, value, needList = false, userId) => {
    const visibleFields = this.commentsVisibleFields(this.fullVisibleFields);

    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);
    query = this.disputeChatInfoJoin(query, userId);
    query = this.commentsInfoJoin(query);

    query = query
      .select(this.disputeChatsVisibleFields(visibleFields))
      .where(key, value);

    if (needList) {
      return await query;
    } else {
      return await query.first();
    }
  };

  getById = (id) => this.getByWhere(`${ORDERS_TABLE}.id`, id);

  getByIdWithDisputeChat = (id, userId) =>
    this.getByWhereWithDisputeChat(`${ORDERS_TABLE}.id`, id, false, userId);

  getLastActive = async (id) => {
    let lastOrderQuery = db(ORDERS_TABLE);
    lastOrderQuery = this.fullOrdersJoin(lastOrderQuery);

    const lastOrder = await lastOrderQuery
      .select(this.fullVisibleFields)
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
        STATIC.ORDER_STATUSES.PENDING_RENTER,
        STATIC.ORDER_STATUSES.PENDING_OWNER,
      ])
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .first();

    return lastOrder;
  };

  getFullByBaseRequest = async (request) => {
    const order = await request();

    if (order) {
      order["listingImages"] = await listingModel.getListingImages(
        order["listingId"]
      );

      order["categoryInfo"] =
        await listingCategoryModel.getRecursiveCategoryList(
          order["listingCategoryId"]
        );
    }

    return order;
  };

  getFullById = (id) => this.getFullByBaseRequest(() => this.getById(id));

  getFullWithPaymentById = (id) =>
    this.getFullByBaseRequest(async () => {
      let query = db(ORDERS_TABLE);
      query = this.fullOrdersJoin(query);
      query = this.payedInfoJoin(query);
      query = query.where(`${ORDERS_TABLE}.id`, id);
      return await query
        .select([...this.fullVisibleFields, ...this.selectPartPayedInfo])
        .first();
    });

  getFullByIdWithDisputeChat = (id, userId) =>
    this.getFullByBaseRequest(() => this.getByIdWithDisputeChat(id, userId));

  getFullWithCommentsById = (id, userId) =>
    this.getFullByBaseRequest(async () => {
      let visibleFields = this.commentsVisibleFields(this.fullVisibleFields);
      visibleFields = this.disputeChatsVisibleFields(visibleFields);

      let query = db(ORDERS_TABLE);

      query = this.fullOrdersJoin(query);
      query = this.commentsInfoJoin(query);
      query = this.disputeChatInfoJoin(query, userId);

      query = query.select(visibleFields).where(`${ORDERS_TABLE}.id`, id);

      return await query.first();
    });

  getFullByRenterListingToken = (token) =>
    this.getFullByBaseRequest(() =>
      this.getByWhere(`${ORDERS_TABLE}.renter_accept_listing_token`, token)
    );

  getFullByOwnerListingToken = (token) =>
    this.getFullByBaseRequest(() =>
      this.getByWhere(`${ORDERS_TABLE}.owner_accept_listing_token`, token)
    );

  setPendingStatus = async (id, status) => {
    await db(ORDERS_TABLE).where("id", id).update("status", status);
    return status;
  };

  setPendingOwnerStatus = async (id) =>
    await this.setPendingStatus(id, STATIC.ORDER_STATUSES.PENDING_OWNER);

  setPendingRenterStatus = async (id) =>
    await this.setPendingStatus(id, STATIC.ORDER_STATUSES.PENDING_RENTER);

  updateOrder = async (
    orderId,
    {
      status = null,
      cancelStatus = null,
      startDate,
      finishDate,
      price,
      prevStartDate,
      prevFinishDate,
      prevPrice,
    }
  ) => {
    const updateProps = {};

    if (status) {
      updateProps["status"] = status;
    }

    if (cancelStatus) {
      updateProps["cancel_status"] = cancelStatus;
    }

    if (finishDate) {
      updateProps["finish_time"] = finishDate;
    }

    if (startDate) {
      updateProps["start_time"] = startDate;
    }

    if (price) {
      updateProps["price"] = price;
    }

    if (prevFinishDate) {
      updateProps["prev_finish_time"] = prevFinishDate;
    }

    if (prevStartDate) {
      updateProps["prev_start_time"] = prevStartDate;
    }

    if (prevPrice) {
      updateProps["prev_price"] = prevPrice;
    }

    await db(ORDERS_TABLE).where("id", orderId).update(updateProps);
  };

  acceptUpdateRequest = (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  acceptOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  rejectOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.REJECTED;
    return this.updateOrder(orderId, newData);
  };

  startCancelByOwner = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_RENTER_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  startCancelByRenter = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  needAdminCancel = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  finish = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED;
    return this.updateOrder(orderId, newData);
  };

  acceptFinish = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.FINISHED;
    return this.updateOrder(orderId, newData);
  };

  successCancelled = async (orderId, newData = {}) => {
    newData["cancelStatus"] = STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
    return this.updateOrder(orderId, newData);
  };

  getUnfinishedRenterCount = async (renterId) => {
    const result = await db(ORDERS_TABLE)
      .whereIn(`${ORDERS_TABLE}.status`, this.processStatuses)
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .where("renter_id", renterId)
      .count("* as count")
      .first();

    return +result?.count;
  };

  getUnfinishedOwnerCount = async (ownerId) => {
    const result = await db(ORDERS_TABLE)
      .whereIn(`${ORDERS_TABLE}.status`, this.processStatuses)
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .leftJoin(
        LISTINGS_TABLE,
        LISTINGS_TABLE + ".id",
        ORDERS_TABLE + ".listing_id"
      )
      .where(LISTINGS_TABLE + ".owner_id", ownerId)
      .count("* as count")
      .first();

    return +result?.count;
  };

  getUnfinishedUserCount = async (userId) => {
    const countUnfinishedRenterOrders = await this.getUnfinishedRenterCount(
      userId
    );
    const countUnfinishedOwnerOrders = await this.getUnfinishedOwnerCount(
      userId
    );

    return +countUnfinishedRenterOrders + +countUnfinishedOwnerOrders;
  };

  getUnfinishedListingCount = async (listingId) => {
    const result = await db(ORDERS_TABLE)
      .where((builder) => {
        builder
          .whereIn(`${ORDERS_TABLE}.status`, this.processStatuses)
          .whereRaw(
            `${ORDERS_TABLE}.cancel_status IS NULL OR ${ORDERS_TABLE}.cancel_status != '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}'`
          );
      })
      .where("listing_id", listingId)
      .count("* as count")
      .first();

    return +result?.count;
  };

  delete = async (orderId) => {
    await db(STATIC.RECIPIENT_STATUSES).where("order_id", orderId).delete();
    await db(SENDER_PAYMENTS_TABLE).where("order_id", orderId).delete();
    await db(ORDER_UPDATE_REQUESTS_TABLE).where("order_id", orderId).delete();
    await db(ORDERS_TABLE).where("id", orderId).delete();
  };

  orderRenterPayed = async (orderId) => {
    const status = STATIC.ORDER_STATUSES.IN_PROCESS;

    await db(ORDERS_TABLE).where({ id: orderId }).update({
      status: status,
    });

    return status;
  };

  orderRenterSendFinishedRequest = async (orderId) => {
    const status = STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED;

    await db(ORDERS_TABLE).where({ id: orderId }).update({
      status,
    });

    return status;
  };

  orderFinished = async (token) => {
    const status = STATIC.ORDER_STATUSES.FINISHED;

    await db(ORDERS_TABLE)
      .where({ owner_accept_listing_token: token })
      .update({
        status,
        finished_at: db.raw("CURRENT_TIMESTAMP"),
      });

    return status;
  };

  orderFinishedById = async (id) => {
    const status = STATIC.ORDER_STATUSES.FINISHED;

    await db(ORDERS_TABLE)
      .where({ id })
      .update({
        status,
        finished_at: db.raw("CURRENT_TIMESTAMP"),
      });

    return status;
  };

  getUserTotalCountOrders = async (userId) => {
    let query = db(ORDERS_TABLE);
    query = this.orderListingJoin(query);

    const resultSelect = await query
      .select(db.raw("COUNT(*) as count"))
      .where(function () {
        this.where(`${LISTINGS_TABLE}.owner_id`, userId);
        /*.orWhere(
          `${ORDERS_TABLE}.renter_id`,
          userId
        );*/
      })
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .first();

    return +resultSelect.count ?? 0;
  };

  getUserActualTotalCountOrders = async (userId) => {
    let query = db(ORDERS_TABLE);
    query = this.orderListingJoin(query);

    const resultSelect = await query
      .select(db.raw("COUNT(*) as count"))
      .where(function () {
        this.where(`${LISTINGS_TABLE}.owner_id`, userId).orWhere(
          `${ORDERS_TABLE}.renter_id`,
          userId
        );
      })
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_OWNER,
        STATIC.ORDER_STATUSES.PENDING_RENTER,
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
        STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
      ])
      .whereNot("cancel_status", STATIC.ORDER_CANCELATION_STATUSES.CANCELLED)
      .first();
    return resultSelect.count ?? 0;
  };

  getOrderStatusesCount = async ({ timeInfos, filter }) => {
    let query = db(ORDERS_TABLE);
    query = query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );

    query = this.orderDisputeJoin(query);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);
    query = query.whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    const result = await query
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE 
            WHEN (${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.FINISHED}' 
            AND ${ORDERS_TABLE}.cancel_status IS NULL AND ${DISPUTES_TABLE}.id IS NULL)
            THEN 1 ELSE 0 END) AS "finishedCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ((${ORDERS_TABLE}.cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}' OR ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}') AND ${DISPUTES_TABLE}.id IS NULL) 
            THEN 1 ELSE 0 END) AS "canceledCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN (${DISPUTES_TABLE}.id IS NOT NULL AND ${DISPUTES_TABLE}.status != '${STATIC.DISPUTE_STATUSES.SOLVED}')
            THEN 1 ELSE 0 END) AS "disputeCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN (${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.FINISHED}' AND ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
            AND ${ORDERS_TABLE}.cancel_status IS NULL AND ${DISPUTES_TABLE}.id IS NULL)
            THEN 1 ELSE 0 END) AS "activeCount"`
        )
      )
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      finishedCount: result["finishedCount"] ?? 0,
      canceledCount: result["canceledCount"] ?? 0,
      disputeCount: result["disputeCount"] ?? 0,
      activeCount: result["activeCount"] ?? 0,
    };
  };

  // This function calculates all the dates between the start and end date of orders, marking them as blocked.
  generateBlockedDatesByOrders = (orders) => {
    const blockedDatesObj = {}; // Initialize an object to track blocked dates

    orders.forEach((order) => {
      let startDate = new Date(order["offerStartDate"]); // Get the start date of the order
      let finishDate = new Date(order["offerFinishDate"]); // Get the end date of the order

      if (order["newStartDate"] && order["newFinishDate"]) {
        startDate = new Date(order["newStartDate"]); // Use new start date if available
        finishDate = new Date(order["newFinishDate"]); // Use new end date if available
      }

      const datesBetween = generateDatesBetween(startDate, finishDate); // Generate all dates between start and end date

      datesBetween.forEach((date) => (blockedDatesObj[date] = true)); // Mark the dates as blocked
    });

    return Object.keys(blockedDatesObj); // Return the list of blocked dates
  };

  getBlockedListingsDatesForListings = async (listingIds, renterId = null) => {
    const currentDate = separateDate(new Date());

    const orders = await db(ORDERS_TABLE)
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
         ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active` // Join with active order update requests
      )
      .whereIn("listing_id", listingIds)
      .whereRaw(
        `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time >= ?) OR (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND finish_time >= ? ))`, // Filter by the end date of the orders
        [currentDate, currentDate]
      )
      .where(function () {
        if (renterId) {
          this.where(function () {
            this.whereNot(
              `${ORDERS_TABLE}.status`,
              STATIC.ORDER_STATUSES.PENDING_OWNER
            ).orWhere("renter_id", renterId);
          });
        }

        this.whereRaw(
          `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCEL_STATUSES.CANCELLED}')` // Exclude cancelled orders
        ).whereNotIn(`${ORDERS_TABLE}.status`, [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.REJECTED,
          STATIC.ORDER_STATUSES.FINISHED,
        ]);
      })
      .select([
        `${ORDERS_TABLE}.id`,
        "start_time as offerStartDate",
        "finish_time as offerFinishDate",
        "listing_id as listingId",
        "new_finish_time as newFinishDate",
        "new_start_time as newStartDate",
      ]);

    const listingBlockedDates = {};

    listingIds.forEach((listingId) => {
      const listingOrders = [];

      orders.forEach((order) => {
        if (order.listingId == listingId) {
          listingOrders.push(order);
        }
      });

      listingBlockedDates[listingId] =
        listingOrders.length > 0
          ? this.generateBlockedDatesByOrders(listingOrders)
          : [];
    });

    return listingBlockedDates;
  };
}

module.exports = new OrderModel();
