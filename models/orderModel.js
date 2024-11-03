require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const { formatDateToSQLFormat } = require("../utils");
const listingModel = require("./listingModel");
const listingCategoryModel = require("./listingCategoryModel");
const checklistModel = require("./checklistModel");

const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;
const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;
const OWNER_COMMENTS_TABLE = STATIC.TABLES.OWNER_COMMENTS;
const WORKER_COMMENTS_TABLE = STATIC.TABLES.WORKER_COMMENTS;
const DISPUTES_TABLE = STATIC.TABLES.DISPUTES;
const CHAT_TABLE = STATIC.TABLES.CHATS;
const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;
const CHECKLISTS_TABLE = STATIC.TABLES.CHECKLISTS;

class OrderModel extends Model {
  lightVisibleFields = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.status`,
    `${ORDERS_TABLE}.cancel_status as cancelStatus`,
    `${ORDERS_TABLE}.worker_fee as workerFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    `${ORDERS_TABLE}.finished_at as offerFinishedAt`,
    `${ORDERS_TABLE}.price as offerPrice`,
    `${ORDERS_TABLE}.finish_time as offerFinishTime`,
    `workers.id as workerId`,
    `workers.name as workerName`,
    `workers.email as workerEmail`,
    `workers.photo as workerPhoto`,
    `workers.phone as workerPhone`,
    `workers.verified as workerVerified`,
    `workers.paypal_id as workerPaypalId`,
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
    `${LISTINGS_TABLE}.finish_time as listingFinishTime`,
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
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_finish_time as newFinishTime`,
  ];

  fullVisibleFields = [
    ...this.lightVisibleFields,
    `${LISTINGS_TABLE}.description as listingDescription`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.postcode as listingPostcode`,
    `${LISTINGS_TABLE}.lat as listingRentalLat`,
    `${LISTINGS_TABLE}.lng as listingRentalLng`,
    `${LISTINGS_TABLE}.radius as listingRentalRadius`,
    `workers.phone as workerPhone`,
    `owners.phone as ownerPhone`,
    `owners.facebook_url as ownerFacebookUrl`,
    `owners.linkedin_url as ownerLinkedinUrl`,
    `owners.instagram_url as ownerInstagramUrl`,
    `workers.facebook_url as workerFacebookUrl`,
    `workers.linkedin_url as workerLinkedinUrl`,
    `workers.instagram_url as workerInstagramUrl`,
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
    `${ORDERS_TABLE}.worker_fee`,
    `${ORDERS_TABLE}.owner_fee`,
    `${ORDERS_TABLE}.price`,
    `${ORDERS_TABLE}.finish_time`,
    `workers.id`,
    `workers.name`,
    `workers.email`,
    `workers.photo`,
    `workers.phone`,
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
    `${LISTINGS_TABLE}.finish_time`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    `${LISTINGS_TABLE}.description`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.postcode`,
    `${LISTINGS_TABLE}.lat`,
    `${LISTINGS_TABLE}.lng`,
    `${LISTINGS_TABLE}.radius`,
    `workers.phone`,
    `owners.phone`,
    `owners.facebook_url`,
    `owners.linkedin_url`,
    `owners.instagram_url`,
    `workers.facebook_url`,
    `workers.linkedin_url`,
    `workers.instagram_url`,
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
  ];

  strFilterFields = [
    `workers.name`,
    `workers.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForWorkers = [
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForOwners = [
    `workers.name`,
    `workers.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  orderFields = [
    `${ORDERS_TABLE}.id`,
    `workers.name`,
    `workers.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  checklistsFields = [
    `owner_checklists.id as ownerChecklistId`,
    `owner_checklists.item_matches_description as ownerChecklistItemMatchesDescription`,
    `owner_checklists.item_matches_photos as ownerChecklistItemMatchesPhotos`,
    `owner_checklists.item_fully_functional as ownerChecklistItemFullyFunctional`,
    `owner_checklists.parts_good_condition as ownerChecklistPartsGoodCondition`,
    `owner_checklists.provided_guidelines as ownerChecklistProvidedGuidelines`,

    `worker_checklists.id as workerChecklistId`,
    `worker_checklists.item_matches_description as workerChecklistItemMatchesDescription`,
    `worker_checklists.item_matches_photos as workerChecklistItemMatchesPhotos`,
    `worker_checklists.item_fully_functional as workerChecklistItemFullyFunctional`,
    `worker_checklists.parts_good_condition as workerChecklistPartsGoodCondition`,
    `worker_checklists.provided_guidelines as workerChecklistProvidedGuidelines`,
  ];

  processStatuses = [
    STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT,
    STATIC.ORDER_STATUSES.PENDING_WORKER,
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
    const offerEndDate = order.offerEndDate;

    let quickCancelLastPossible = new Date(offerEndDate);
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
        `${USERS_TABLE} as workers`,
        `workers.id`,
        "=",
        `${orderTable}.worker_id`
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

  orderChecklistsJoin = (query, orderTable = ORDERS_TABLE) => {
    return query
      .joinRaw(
        `LEFT JOIN ${CHECKLISTS_TABLE} as owner_checklists ON (owner_checklists.order_id = ${orderTable}.id AND owner_checklists.type = '${STATIC.CHECKLIST_TYPES.OWNER}')`
      )
      .joinRaw(
        `LEFT JOIN ${CHECKLISTS_TABLE} as worker_checklists ON (worker_checklists.order_id = ${orderTable}.id AND worker_checklists.type = '${STATIC.CHECKLIST_TYPES.WORKER}')`
      );
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
      `LEFT JOIN ${WORKER_COMMENTS_TABLE} as "worker_comments" 
      ON worker_comments.order_id = ${ORDERS_TABLE}.id`
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

      `worker_comments.id as workerCommentId`,
      `owner_comments.id as ownerCommentId`,

      `worker_comments.waiting_admin as workerCommentWaitingAdmin`,
      `owner_comments.waiting_admin as ownerCommentWaitingAdmin`,

      `worker_comments.waiting_admin as workerCommentApproved`,
      `owner_comments.waiting_admin as ownerCommentApproved`,
    ];
  };

  disputeChatsVisibleFields = (visibleFields) => {
    return [...visibleFields, `dispute_chats.id as disputeChatId`];
  };

  workerBaseGetQuery = (filter, workerId) => {
    const baseGetReq = this.fullBaseGetQueryWithRequestInfo;
    let query = baseGetReq(filter);
    query = this.payedInfoJoin(query);
    return query.whereRaw("workers.id = ?", workerId);
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
          STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT
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

  baseWorkerTotalCount = async (filter, workerId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.workerBaseGetQuery(filter, workerId);

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

  baseWorkerList = async (props) => {
    const { filter, start, count, workerId } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.workerBaseGetQuery(filter, workerId);
    query = this.commentsInfoJoin(query);
    query = this.disputeChatInfoJoin(query, workerId);

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

  workerOrdersTotalCount = async (filter, userId) => {
    return await this.baseWorkerTotalCount(filter, userId);
  };

  workerOrdersList = async (props) => {
    return await this.baseWorkerList(props);
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
    workerId,
    ownerFee,
    workerFee,
    price,
    finishTime,
  }) => {
    const res = await db(ORDERS_TABLE)
      .insert({
        listing_id: listingId,
        worker_id: workerId,
        owner_fee: ownerFee,
        worker_fee: workerFee,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        price,
        finish_time: finishTime,
      })
      .returning("id");

    return res[0]["id"];
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
        STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT,
        STATIC.ORDER_STATUSES.PENDING_WORKER,
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

  getFullWithPaymentAndChecklistsById = (id) =>
    this.getFullByBaseRequest(async () => {
      let query = db(ORDERS_TABLE);
      query = this.fullOrdersJoin(query);
      query = this.payedInfoJoin(query);
      query = this.orderChecklistsJoin(query);
      query = query.where(`${ORDERS_TABLE}.id`, id);

      const order = await query
        .select([
          ...this.checklistsFields,
          ...this.fullVisibleFields,
          ...this.selectPartPayedInfo,
        ])
        .first();

      if (!order) {
        return null;
      }

      order["ownerChecklistsImages"] = [];
      order["workerChecklistsImages"] = [];

      if (order["ownerChecklistId"]) {
        order["ownerChecklistsImages"] = await checklistModel.getImages(
          order["ownerChecklistId"]
        );
      }

      if (order["workerChecklistId"]) {
        order["workerChecklistsImages"] = await checklistModel.getImages(
          order["workerChecklistId"]
        );
      }

      return order;
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

  getFullByWorkerListingToken = (token) =>
    this.getFullByBaseRequest(() =>
      this.getByWhere(`${ORDERS_TABLE}.worker_accept_listing_token`, token)
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

  setPendingWorkerStatus = async (id) =>
    await this.setPendingStatus(id, STATIC.ORDER_STATUSES.PENDING_WORKER);

  updateOrder = async (
    orderId,
    {
      status = null,
      cancelStatus = null,
      finishTime,
      price,
      prevFinishTime,
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

    if (finishTime) {
      updateProps["finish_time"] = finishTime;
    }

    if (price) {
      updateProps["price"] = price;
    }

    if (prevFinishTime) {
      updateProps["prev_finish_time"] = finishTime;
    }

    if (prevPrice) {
      updateProps["prev_price"] = prevPrice;
    }

    await db(ORDERS_TABLE).where("id", orderId).update(updateProps);
  };

  acceptUpdateRequest = (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  acceptOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  rejectOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.REJECTED;
    return this.updateOrder(orderId, newData);
  };

  startCancelByOwner = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_WORKER_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  startCancelByWorker = async (orderId, newData = {}) => {
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

  getUnfinishedWorkerCount = async (workerId) => {
    const result = await db(ORDERS_TABLE)
      .whereIn(`${ORDERS_TABLE}.status`, this.processStatuses)
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .where("worker_id", workerId)
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
    const countUnfinishedWorkerOrders = await this.getUnfinishedWorkerCount(
      userId
    );
    const countUnfinishedOwnerOrders = await this.getUnfinishedOwnerCount(
      userId
    );

    return +countUnfinishedWorkerOrders + +countUnfinishedOwnerOrders;
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

  orderWorkerPayed = async (orderId) => {
    const status = STATIC.ORDER_STATUSES.IN_PROCESS;

    await db(ORDERS_TABLE).where({ id: orderId }).update({
      status: status,
    });

    return status;
  };

  orderWorkerSendFinishedRequest = async (orderId) => {
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
          `${ORDERS_TABLE}.worker_id`,
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
          `${ORDERS_TABLE}.worker_id`,
          userId
        );
      })
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_OWNER,
        STATIC.ORDER_STATUSES.PENDING_WORKER,
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
        STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT,
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
}

module.exports = new OrderModel();
