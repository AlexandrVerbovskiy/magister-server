require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  separateDate,
  generateDatesBetween,
  formatDateToSQLFormat,
  cloneObject,
} = require("../utils");
const listingModel = require("./listingModel");
const listingCategoryModel = require("./listingCategoryModel");

const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;
const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;
const OWNER_COMMENTS_TABLE = STATIC.TABLES.OWNER_COMMENTS;
const TENANT_COMMENTS_TABLE = STATIC.TABLES.TENANT_COMMENTS;
const DISPUTES_TABLE = STATIC.TABLES.DISPUTES;
const CHAT_TABLE = STATIC.TABLES.CHATS;
const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;

class OrderModel extends Model {
  lightVisibleFields = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.status`,
    `${ORDERS_TABLE}.cancel_status as cancelStatus`,
    `${ORDERS_TABLE}.price_per_day as offerPricePerDay`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.end_date as offerEndDate`,
    `${ORDERS_TABLE}.tenant_fee as tenantFee`,
    `${ORDERS_TABLE}.owner_fee as ownerFee`,
    `${ORDERS_TABLE}.prev_price_per_day as prevPricePerDay`,
    `${ORDERS_TABLE}.prev_start_date as prevStartDate`,
    `${ORDERS_TABLE}.prev_end_date as prevEndDate`,
    `${ORDERS_TABLE}.finished_at as offerFinishedAt`,
    `${ORDERS_TABLE}.parent_id as orderParentId`,
    `tenants.id as tenantId`,
    `tenants.name as tenantName`,
    `tenants.email as tenantEmail`,
    `tenants.photo as tenantPhoto`,
    `tenants.phone as tenantPhone`,
    `owners.id as ownerId`,
    `owners.name as ownerName`,
    `owners.email as ownerEmail`,
    `owners.photo as ownerPhoto`,
    `owners.phone as ownerPhone`,
    `owners.verified as ownerVerified`,
    `owners.paypal_id as ownerPaypalId`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.defects as listingDefects`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `${LISTINGS_TABLE}.price_per_day as listingPricePerDay`,
    `${LISTINGS_TABLE}.min_rental_days as listingMinRentalDays`,
    `${LISTINGS_TABLE}.count_stored_items as listingCountStoredItems`,
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTINGS_TABLE}.other_category as listingOtherCategory`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
    `${DISPUTES_TABLE}.id as disputeId`,
    `${DISPUTES_TABLE}.status as disputeStatus`,
    `${DISPUTES_TABLE}.type as disputeType`,
    `${DISPUTES_TABLE}.description as disputeDescription`,
    `${CHAT_TABLE}.id as chatId`,
  ];

  requestVisibleFields = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id as requestId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
  ];

  fullVisibleFields = [
    ...this.lightVisibleFields,
    `${LISTINGS_TABLE}.description as listingDescription`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.postcode as listingPostcode`,
    `${LISTINGS_TABLE}.rental_lat as listingRentalLat`,
    `${LISTINGS_TABLE}.rental_lng as listingRentalLng`,
    `${LISTINGS_TABLE}.rental_radius as listingRentalRadius`,
    `${LISTINGS_TABLE}.compensation_cost as compensationCost`,
    `${ORDERS_TABLE}.tenant_accept_listing_qrcode as tenantAcceptListingQrcode`,
    `${ORDERS_TABLE}.owner_accept_listing_qrcode as ownerAcceptListingQrcode`,
    `tenants.phone as tenantPhone`,
    `owners.phone as ownerPhone`,
    `tenants.place_work as tenantPlaceWork`,
    `owners.place_work as ownerPlaceWork`,
    `owners.twitter_url as ownerTwitterUrl`,
    `owners.facebook_url as ownerFacebookUrl`,
    `owners.linkedin_url as ownerLinkedinUrl`,
    `owners.instagram_url as ownerInstagramUrl`,
    `tenants.twitter_url as tenantTwitterUrl`,
    `tenants.facebook_url as tenantFacebookUrl`,
    `tenants.linkedin_url as tenantLinkedinUrl`,
    `tenants.instagram_url as tenantInstagramUrl`,
    `parent_chats.id as parentChatId`,
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
    `${ORDERS_TABLE}.price_per_day`,
    `${ORDERS_TABLE}.start_date`,
    `${ORDERS_TABLE}.end_date`,
    `${ORDERS_TABLE}.tenant_fee`,
    `${ORDERS_TABLE}.owner_fee`,
    `${ORDERS_TABLE}.prev_price_per_day`,
    `${ORDERS_TABLE}.prev_start_date`,
    `${ORDERS_TABLE}.prev_end_date`,
    `tenants.id`,
    `tenants.name`,
    `tenants.email`,
    `tenants.photo`,
    `tenants.phone`,
    `owners.id`,
    `owners.name`,
    `owners.email`,
    `owners.photo`,
    `owners.phone`,
    `${LISTINGS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.price_per_day`,
    `${LISTINGS_TABLE}.min_rental_days`,
    `${LISTINGS_TABLE}.category_id`,
    `${LISTINGS_TABLE}.other_category`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    `${LISTINGS_TABLE}.description`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.postcode`,
    `${LISTINGS_TABLE}.rental_lat`,
    `${LISTINGS_TABLE}.rental_lng`,
    `${LISTINGS_TABLE}.rental_radius`,
    `${LISTINGS_TABLE}.compensation_cost`,
    `${LISTINGS_TABLE}.count_stored_items`,
    `${ORDERS_TABLE}.tenant_accept_listing_qrcode`,
    `${ORDERS_TABLE}.owner_accept_listing_qrcode`,
    `tenants.phone`,
    `owners.phone`,
    `tenants.place_work`,
    `owners.place_work`,
    `owners.twitter_url`,
    `owners.facebook_url`,
    `owners.linkedin_url`,
    `owners.instagram_url`,
    `tenants.twitter_url`,
    `tenants.facebook_url`,
    `tenants.linkedin_url`,
    `tenants.instagram_url`,
    `${DISPUTES_TABLE}.id`,
    `${DISPUTES_TABLE}.status`,
    `${DISPUTES_TABLE}.type`,
    `${DISPUTES_TABLE}.description`,
    `${CHAT_TABLE}.id`,
    `parent_chats.id`,
  ];

  requestGroupBy = [
    `${ORDER_UPDATE_REQUESTS_TABLE}.id`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day`,
  ];

  strFilterFields = [
    `tenants.name`,
    `tenants.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForTenants = [
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  strFilterFieldsForOwners = [
    `tenants.name`,
    `tenants.email`,
    `${LISTINGS_TABLE}.name`,
  ];

  orderFields = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.price_per_day`,
    `tenants.name`,
    `tenants.email`,
    `owners.name`,
    `owners.email`,
    `orders.start_date`,
    `orders.end_date`,
    `${LISTINGS_TABLE}.name`,
  ];

  processStatuses = [
    STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
    STATIC.ORDER_STATUSES.PENDING_TENANT,
    STATIC.ORDER_STATUSES.PENDING_OWNER,
    STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
    STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
  ];

  canFastCancelPayedOrder = (order) => {
    if (order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) {
      return false;
    }

    const today = new Date();
    const offerStartDate = order.offerStartDate;

    let quickCancelLastPossible = new Date(offerStartDate);
    quickCancelLastPossible.setDate(quickCancelLastPossible.getDate() - 2);

    return today <= quickCancelLastPossible;
  };

  canFinalizationOrder = (order) => {
    if (order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
      return false;
    }

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
        `${USERS_TABLE} as tenants`,
        `tenants.id`,
        "=",
        `${orderTable}.tenant_id`
      );
  };

  fullOrdersJoin = (query) => {
    query = this.orderListingJoin(query);
    query = this.orderUsersJoin(query);
    query = this.orderDisputeJoin(query);

    query = query.joinRaw(
      `LEFT JOIN ${CHAT_TABLE} ON (${CHAT_TABLE}.entity_type = '${STATIC.CHAT_TYPES.ORDER}' AND ${CHAT_TABLE}.entity_id = ${ORDERS_TABLE}.id)`
    );

    query = query.joinRaw(
      `LEFT JOIN ${CHAT_TABLE} as parent_chats ON (parent_chats.entity_type = '${STATIC.CHAT_TYPES.ORDER}' AND parent_chats.entity_id = ${ORDERS_TABLE}.parent_id)`
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
      `LEFT JOIN ${TENANT_COMMENTS_TABLE} as "tenant_comments" 
      ON tenant_comments.order_id = ${ORDERS_TABLE}.id`
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

      `tenant_comments.id as tenantCommentId`,
      `owner_comments.id as ownerCommentId`,

      `tenant_comments.waiting_admin as tenantCommentWaitingAdmin`,
      `owner_comments.waiting_admin as ownerCommentWaitingAdmin`,

      `tenant_comments.waiting_admin as tenantCommentApproved`,
      `owner_comments.waiting_admin as ownerCommentApproved`,
    ];
  };

  disputeChatsVisibleFields = (visibleFields) => {
    return [...visibleFields, `dispute_chats.id as disputeChatId`];
  };

  tenantBaseGetQuery = (filter, tenantId) => {
    const baseGetReq = this.fullBaseGetQueryWithRequestInfo;
    let query = baseGetReq(filter);
    query = this.payedInfoJoin(query);
    query = query.whereNull(`${ORDERS_TABLE}.parent_id`);
    return query.whereRaw("tenants.id = ?", tenantId);
  };

  ownerBaseGetQuery = (filter, ownerId) => {
    const baseGetReq = this.fullBaseGetQueryWithRequestInfo;
    let query = baseGetReq(filter);
    query = query.whereNull(`${ORDERS_TABLE}.parent_id`);
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
          STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
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

  baseTenantTotalCount = async (filter, tenantId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.tenantBaseGetQuery(filter, tenantId);

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

  baseTenantList = async (props) => {
    const { filter, start, count, tenantId } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.tenantBaseGetQuery(filter, tenantId);
    query = this.commentsInfoJoin(query);
    query = this.disputeChatInfoJoin(query, tenantId);

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

  tenantOrdersTotalCount = async (filter, userId) => {
    return await this.baseTenantTotalCount(filter, userId);
  };

  tenantOrdersList = async (props) => {
    return await this.baseTenantList(props);
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

    const result = await query
      .whereNull(`${ORDERS_TABLE}.parent_id`)
      .count("* as count")
      .first();
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
      .whereNull(`${ORDERS_TABLE}.parent_id`)

      .select([...this.fullVisibleFields, ...this.selectPartPayedInfo])
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  create = async ({
    pricePerDay,
    startDate,
    endDate,
    listingId,
    tenantId,
    ownerFee,
    tenantFee,
    feeActive,
    orderParentId = null,
  }) => {
    const res = await db(ORDERS_TABLE)
      .insert({
        price_per_day: pricePerDay,
        start_date: startDate,
        end_date: endDate,
        listing_id: listingId,
        tenant_id: tenantId,
        owner_fee: ownerFee,
        tenant_fee: tenantFee,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        tenant_accept_listing_qrcode: "",
        owner_accept_listing_qrcode: "",
        fee_active: feeActive,
        parent_id: orderParentId,
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

  getChildrenList = (parentId) =>
    this.getByWhere(`${ORDERS_TABLE}.parent_id`, parentId, true);

  getLastActive = async (id) => {
    let lastOrderQuery = db(ORDERS_TABLE);
    lastOrderQuery = this.fullOrdersJoin(lastOrderQuery);

    const lastOrder = await lastOrderQuery
      .select(this.fullVisibleFields)
      .where(`${ORDERS_TABLE}.parent_id`, id)
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
        STATIC.ORDER_STATUSES.PENDING_TENANT,
        STATIC.ORDER_STATUSES.PENDING_OWNER,
      ])
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .orderBy(`${ORDERS_TABLE}.end_date`, "desc")
      .first();

    return lastOrder;
  };

  checkOrderHasUnstartedExtension = async (orderId) => {
    let lastOrderQuery = db(ORDERS_TABLE);
    lastOrderQuery = this.fullOrdersJoin(lastOrderQuery);

    const lastOrder = await lastOrderQuery
      .select(this.fullVisibleFields)
      .where(`${ORDERS_TABLE}.parent_id`, orderId)
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
        STATIC.ORDER_STATUSES.PENDING_OWNER,
        STATIC.ORDER_STATUSES.PENDING_TENANT,
        STATIC.ORDER_STATUSES.REJECTED,
      ])
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .first();

    return !!lastOrder;
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

  getFullByTenantListingToken = (token) =>
    this.getFullByBaseRequest(() =>
      this.getByWhere(`${ORDERS_TABLE}.tenant_accept_listing_token`, token)
    );

  getFullByOwnerListingToken = (token) =>
    this.getFullByBaseRequest(() =>
      this.getByWhere(`${ORDERS_TABLE}.owner_accept_listing_token`, token)
    );

  generateBlockedDatesByOrders = (orders) => {
    const blockedDatesObj = {};

    orders.forEach((order) => {
      let startDate = new Date(order["offerStartDate"]);
      let endDate = new Date(order["offerEndDate"]);

      if (order["newStartDate"] && order["newEndDate"]) {
        startDate = new Date(order["newStartDate"]);
        endDate = new Date(order["newEndDate"]);
      }

      const datesBetween = generateDatesBetween(startDate, endDate);

      datesBetween.forEach((date) => (blockedDatesObj[date] = true));
    });

    return Object.keys(blockedDatesObj);
  };

  baseConflictOrdersForOrders = (orderIds) => {
    const currentDate = separateDate(new Date());

    return db(`${ORDERS_TABLE} as main_orders`)
      .whereIn("main_orders.id", orderIds)
      .joinRaw(
        `JOIN ${ORDERS_TABLE} ON (main_orders.listing_id = ${ORDERS_TABLE}.listing_id AND main_orders.id != ${ORDERS_TABLE}.id)`
      )
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
         ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
      )
      .whereRaw(
        `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= ?) OR (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND ${ORDERS_TABLE}.end_date >= ? ))`,
        [currentDate, currentDate]
      )
      .where(function () {
        this.whereRaw(
          `NOT (${ORDERS_TABLE}.cancel_status IS NOT NULL AND ${ORDERS_TABLE}.cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}')`
        ).whereNotIn(`${ORDERS_TABLE}.status`, [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.REJECTED,
          STATIC.ORDER_STATUSES.FINISHED,
        ]);
      });
  };

  getBlockedListingsDatesForOrders = async (orderIds) => {
    const orders = await this.baseConflictOrdersForOrders(orderIds).select([
      `main_orders.id as mainOrderId`,
      `${ORDERS_TABLE}.id`,
      `${ORDERS_TABLE}.start_date as offerStartDate`,
      `${ORDERS_TABLE}.end_date as offerEndDate`,
      `${ORDERS_TABLE}.listing_id as listingId`,
      `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
      `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
    ]);

    const orderBlockedDates = {};

    orderIds.forEach((mainOrderId) => {
      const mainOrders = [];

      orders.forEach((order) => {
        if (order.mainOrderId == mainOrderId) {
          mainOrders.push(order);
        }
      });

      orderBlockedDates[mainOrderId] =
        mainOrders.length > 0
          ? this.generateBlockedDatesByOrders(mainOrders)
          : [];
    });

    return orderBlockedDates;
  };

  getBlockedListingsDatesForListings = async (listingIds, tenantId = null) => {
    const currentDate = separateDate(new Date());

    const orders = await db(ORDERS_TABLE)
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
         ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
      )
      .whereIn("listing_id", listingIds)
      .whereRaw(
        `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= ?) OR (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND end_date >= ? ))`,
        [currentDate, currentDate]
      )
      .where(function () {
        if (tenantId) {
          this.where(function () {
            this.whereNot(
              "status",
              STATIC.ORDER_STATUSES.PENDING_OWNER
            ).orWhere("tenant_id", tenantId);
          });
        }

        this.whereRaw(
          `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}')`
        ).whereNotIn("status", [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.REJECTED,
          STATIC.ORDER_STATUSES.FINISHED,
        ]);
      })
      .select([
        `${ORDERS_TABLE}.id`,
        "start_date as offerStartDate",
        "end_date as offerEndDate",
        "listing_id as listingId",
        "new_end_date as newEndDate",
        "new_start_date as newStartDate",
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

  getOrdersExtends = async (orderIds) => {
    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);
    query = this.baseRequestInfoJoin(query);
    query = this.commentsInfoJoin(query);

    let visibleFields = [
      ...this.fullVisibleFields,
      ...this.requestVisibleFields,
    ];

    visibleFields = this.commentsVisibleFields(visibleFields);

    const orderExtends = await query
      .whereIn(`${ORDERS_TABLE}.parent_id`, orderIds)
      .whereNot(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .select(visibleFields);

    return orderExtends.map((orderExtend) => {
      const newOrderExtend = cloneObject(orderExtend);

      if (orderExtend.requestId) {
        newOrderExtend["actualUpdateRequest"] = {
          id: orderExtend.requestId,
          newStartDate: orderExtend.newStartDate,
          newEndDate: orderExtend.newEndDate,
          newPricePerDay: orderExtend.newPricePerDay,
        };
      }

      return newOrderExtend;
    });
  };

  getOrderExtends = (orderId) => this.getOrdersExtends([orderId]);

  getConflictOrders = async (orderIds, fullInfo = false) => {
    let query = this.baseConflictOrdersForOrders(orderIds);
    query = this.fullOrdersJoin(query);

    const selectFields = fullInfo
      ? [
          `main_orders.id as mainOrderId`,
          ...this.fullVisibleFields,
          ...this.requestVisibleFields,
        ]
      : [
          `main_orders.id as mainOrderId`,
          `${ORDERS_TABLE}.id`,
          `${ORDERS_TABLE}.start_date as offerStartDate`,
          `${ORDERS_TABLE}.end_date as offerEndDate`,
          `${ORDER_UPDATE_REQUESTS_TABLE}.id as requestId`,
          `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
          `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
        ];

    const conflictOrders = await query
      .groupBy([`main_orders.id`, ...this.fullGroupBy, ...this.requestGroupBy])
      .select(selectFields);

    const res = {};

    orderIds.forEach((orderId) => {
      const currentOrderConflicts = [];

      conflictOrders.forEach((conflict) => {
        if (conflict.mainOrderId == orderId) {
          const copiedConflict = cloneObject(conflict);
          delete copiedConflict["mainOrderId"];
          currentOrderConflicts.push(copiedConflict);
        }
      });

      res[orderId] = currentOrderConflicts;
    });

    return res;
  };

  getBlockedListingDates = async (listingId) => {
    const currentDate = separateDate(new Date());

    const orders = await db(ORDERS_TABLE)
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
      )
      .where("listing_id", listingId)
      .whereRaw(
        `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= ?) OR (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND end_date >= ? ))`,
        [currentDate, currentDate]
      )
      .whereNot("status", STATIC.ORDER_STATUSES.PENDING_OWNER)
      .whereRaw(
        `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}')`
      )
      .whereNot("status", STATIC.ORDER_STATUSES.REJECTED)
      .select([
        "end_date as endDate",
        "start_date as startDate",
        "new_end_date as newEndDate",
        "new_start_date as newStartDate",
      ]);

    return this.generateBlockedDatesByOrders(orders);
  };

  setPendingTenantStatus = async (id) => {
    const status = STATIC.ORDER_STATUSES.PENDING_TENANT;
    await db(ORDERS_TABLE)
      .where("id", id)
      .update("status", STATIC.ORDER_STATUSES.PENDING_TENANT);
    return status;
  };

  setPendingOwnerStatus = async (id) => {
    const status = STATIC.ORDER_STATUSES.PENDING_OWNER;
    await db(ORDERS_TABLE).where("id", id).update("status", status);
    return status;
  };

  updateOrder = async (
    orderId,
    {
      newStartDate,
      newEndDate,
      newPricePerDay,
      prevPricePerDay,
      prevStartDate,
      prevEndDate,
      orderParentId,
      status = null,
      cancelStatus = null,
    }
  ) => {
    const updateProps = {
      start_date: newStartDate,
      end_date: newEndDate,
      price_per_day: newPricePerDay,
      prev_price_per_day: prevPricePerDay,
      prev_start_date: prevStartDate,
      prev_end_date: prevEndDate,
      parent_id: orderParentId,
    };

    if (status) {
      updateProps["status"] = status;
    }

    if (cancelStatus) {
      updateProps["cancel_status"] = cancelStatus;
    }

    await db(ORDERS_TABLE).where("id", orderId).update(updateProps);
  };

  acceptUpdateRequest = (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  acceptOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  rejectOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.REJECTED;
    return this.updateOrder(orderId, newData);
  };

  startCancelByOwner = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  startCancelByTenant = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  needAdminCancel = async (orderId, newData = {}) => {
    newData["cancelStatus"] =
      STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE;
    return this.updateOrder(orderId, newData);
  };

  successCancelled = async (orderId, newData = {}) => {
    newData["cancelStatus"] = STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
    return this.updateOrder(orderId, newData);
  };

  getUnfinishedTenantCount = async (tenantId) => {
    const result = await db(ORDERS_TABLE)
      .whereIn(`${ORDERS_TABLE}.status`, this.processStatuses)
      .whereNull(`${ORDERS_TABLE}.cancel_status`)
      .where("tenant_id", tenantId)
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
    const countUnfinishedTenantOrders = await this.getUnfinishedTenantCount(
      userId
    );
    const countUnfinishedOwnerOrders = await this.getUnfinishedOwnerCount(
      userId
    );

    return +countUnfinishedTenantOrders + +countUnfinishedOwnerOrders;
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

  orderTenantPayed = async (orderId, { token, qrCode }) => {
    const status = STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT;

    await db(ORDERS_TABLE).where({ id: orderId }).update({
      tenant_accept_listing_token: token,
      tenant_accept_listing_qrcode: qrCode,
      status: status,
    });

    return status;
  };

  orderTenantGotListing = async (orderId, { token, qrCode }) => {
    const status = STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER;

    await db(ORDERS_TABLE).where({ id: orderId }).update({
      owner_accept_listing_token: token,
      owner_accept_listing_qrcode: qrCode,
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

  orderUpdateEndDate = async (id, endDate) => {
    await db(ORDERS_TABLE).where({ id }).update({
      end_date: endDate,
    });
  };

  orderCancelExtends = async (id) => {
    await db(ORDERS_TABLE)
      .where({ parent_id: id })
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_OWNER,
        STATIC.ORDER_STATUSES.PENDING_TENANT,
        STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
      ])
      .update({
        cancel_status: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      });
  };

  getUserTotalCountOrders = async (userId) => {
    let query = db(ORDERS_TABLE);
    query = this.orderListingJoin(query);

    const resultSelect = await query
      .select(db.raw("COUNT(*) as count"))
      .where(function () {
        this.where(`${LISTINGS_TABLE}.owner_id`, userId);
        /*.orWhere(
          `${ORDERS_TABLE}.tenant_id`,
          userId
        );*/
      })
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .first();
    return resultSelect.count ?? 0;
  };

  getInUseListingsBaseQuery = (dateStart, dateEnd) => {
    let query = db(ORDERS_TABLE);
    query = this.orderListingJoin(query);

    return query
      .whereIn(`${ORDERS_TABLE}.status`, [
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .whereNull("cancel_status")
      .where("start_date", ">=", formatDateToSQLFormat(dateStart))
      .where("end_date", "<=", formatDateToSQLFormat(dateEnd))
      .select([
        `${LISTINGS_TABLE}.id as listingId`,
        "start_date as startDate",
        "end_date as endDate",
      ]);
  };

  getInUseListings = async (dateStart, dateEnd) => {
    return await this.getInUseListingsBaseQuery(dateStart, dateEnd);
  };

  getInUseUserListings = async (dateStart, dateEnd, userId) => {
    return await this.getInUseListingsBaseQuery(dateStart, dateEnd).where(
      `${LISTINGS_TABLE}.owner_id`,
      userId
    );
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
      .whereNull(`${ORDERS_TABLE}.parent_id`)
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
