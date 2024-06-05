require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  getDaysDifference,
  separateDate,
  generateDatesBetween,
  formatDateToSQLFormat,
} = require("../utils");
const listingModel = require("./listingModel");
const listingCategoryModel = require("./listingCategoryModel");

const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;
const LISTING_DEFECT_QUESTION_RELATIONS_TABLE =
  STATIC.TABLES.LISTING_DEFECT_QUESTION_RELATIONS;
const SENDER_PAYMENTS_TABLE = STATIC.TABLES.SENDER_PAYMENTS;

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
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `${LISTINGS_TABLE}.price_per_day as listingPricePerDay`,
    `${LISTINGS_TABLE}.min_rental_days as listingMinRentalDays`,
    `${LISTINGS_TABLE}.count_stored_items as listingCountStoredItems`,
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
  ];

  lightRequestVisibleFields = [
    ...this.lightVisibleFields,
    `${ORDER_UPDATE_REQUESTS_TABLE}.id as requestId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
  ];

  fullVisibleFields = [
    ...this.lightVisibleFields,
    `${LISTINGS_TABLE}.description as listingDescription`,
    `${LISTINGS_TABLE}.rental_terms as listingRentalTerms`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.postcode as listingPostcode`,
    `${LISTINGS_TABLE}.rental_lat as listingRentalLat`,
    `${LISTINGS_TABLE}.rental_lng as listingRentalLng`,
    `${LISTINGS_TABLE}.rental_radius as listingRentalRadius`,
    `${LISTINGS_TABLE}.compensation_cost as compensationCost`,
    `${LISTINGS_TABLE}.dop_defect as listingDopDefect`,
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
  ];

  selectPartPayedInfo = [
    `${SENDER_PAYMENTS_TABLE}.failed_description as payedFailedDescription`,
    `${SENDER_PAYMENTS_TABLE}.waiting_approved as payedWaitingApproved`,
    `${SENDER_PAYMENTS_TABLE}.admin_approved as payedAdminApproved`,
    `${SENDER_PAYMENTS_TABLE}.type as payedType`,
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
    `${LISTINGS_TABLE}.name`,
  ];

  processStatuses = [
    STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
    STATIC.ORDER_STATUSES.PENDING_TENANT,
    STATIC.ORDER_STATUSES.PENDING_OWNER,
    STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
    STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
  ];

  bookingStatuses = [
    STATIC.ORDER_STATUSES.PENDING_OWNER,
    STATIC.ORDER_STATUSES.PENDING_TENANT,
    STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
    STATIC.ORDER_STATUSES.REJECTED,
  ];

  canFastCancelPayedOrder = (order) => {
    if (order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
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

  fullBaseGetQuery = (filter) => {
    let query = db(ORDERS_TABLE)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
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
      )
      .whereRaw(this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`));

    return query;
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
        this.baseStringStartFilterDateWrap("start_date"),
        ">=",
        formatDateToSQLFormat(timeInfos.serverFromTime)
      );
    }

    if (timeInfos.serverToTime) {
      query = query.where(
        this.baseStringEndFilterDateWrap("end_date"),
        "<=",
        formatDateToSQLFormat(timeInfos.serverToTime)
      );
    }

    return query;
  };

  orderWithRequestTimeFilterWrap = (query, timeInfos) => {
    if (timeInfos.serverFromTime || timeInfos.serverToTime) {
      const fromDateCondition = timeInfos.serverFromTime
        ? `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND CONCAT(DATE(${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date), ' 00:00:00') >= ?) 
        OR 
        (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND CONCAT(DATE(${ORDERS_TABLE}.start_date), ' 00:00:00') >= ?))`
        : "";

      const toDateCondition = timeInfos.serverToTime
        ? `((${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND CONCAT(DATE(${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date), ' 23:59:59') <= ?) 
        OR 
        (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND CONCAT(DATE(${ORDERS_TABLE}.end_date), ' 23:59:59') <= ?))`
        : "";

      const whereClause = [fromDateCondition, toDateCondition]
        .filter((condition) => condition !== "")
        .join(" AND ");

      query = query.whereRaw(`(${whereClause})`, [
        timeInfos.serverFromTime
          ? formatDateToSQLFormat(timeInfos.serverFromTime)
          : null,
        timeInfos.serverFromTime
          ? formatDateToSQLFormat(timeInfos.serverFromTime)
          : null,
        timeInfos.serverToTime
          ? formatDateToSQLFormat(timeInfos.serverToTime)
          : null,
        timeInfos.serverToTime
          ? formatDateToSQLFormat(timeInfos.serverToTime)
          : null,
      ]);
    }

    return query;
  };

  fullBaseGetQueryWithRequestInfo = (filter) => {
    let query = this.fullBaseGetQuery(filter);

    return query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );
  };

  payedInfoJoin = (query) => {
    return query.joinRaw(
      `LEFT JOIN ${SENDER_PAYMENTS_TABLE} ON
       ${SENDER_PAYMENTS_TABLE}.order_id = ${ORDERS_TABLE}.id`
    );
  };

  tenantBaseGetQuery = (
    filter,
    timeInfos,
    tenantId,
    needRequestInfo = false,
    needPayedInfo = false
  ) => {
    const baseGetReq = needRequestInfo
      ? this.fullBaseGetQueryWithRequestInfo
      : this.fullBaseGetQuery;

    let query = baseGetReq(filter);

    if (needPayedInfo) {
      query = this.payedInfoJoin(query);
    }

    query = needRequestInfo
      ? this.orderWithRequestTimeFilterWrap(query, timeInfos)
      : this.orderTimeFilterWrap(query, timeInfos);

    return query.whereRaw("tenants.id = ?", tenantId);
  };

  ownerBaseGetQuery = (filter, timeInfos, ownerId, needRequestInfo = false) => {
    const baseGetReq = needRequestInfo
      ? this.fullBaseGetQueryWithRequestInfo
      : this.fullBaseGetQuery;

    let query = baseGetReq(filter);

    query = needRequestInfo
      ? this.orderWithRequestTimeFilterWrap(query, timeInfos)
      : this.orderTimeFilterWrap(query, timeInfos);

    return query.whereRaw("owners.id = ?", ownerId);
  };

  baseQueryListByType = (query, type) => {
    if (type == "finished") {
      query = query
        .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "rejected") {
      query = query
        .where(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.REJECTED)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "canceled") {
      query = query.where(
        `${ORDERS_TABLE}.cancel_status`,
        STATIC.ORDER_CANCELATION_STATUSES.CANCELLED
      );
    }

    if (type == "in-dispute") {
      query = query
        .whereNotNull(`${ORDERS_TABLE}.cancel_status`)
        .whereNot(
          `${ORDERS_TABLE}.cancel_status`,
          STATIC.ORDER_CANCELATION_STATUSES.CANCELLED
        );
    }

    if (type == "accepted") {
      query = query
        .where(
          `${ORDERS_TABLE}.status`,
          STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT
        )
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    if (type == "active") {
      query = query
        .whereNot(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.FINISHED)
        .whereNull(`${ORDERS_TABLE}.cancel_status`);
    }

    return query;
  };

  fullTotalCount = async (filter, timeInfos) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.fullBaseGetQuery(filter);
    query = this.orderTimeFilterWrap(query, timeInfos);

    const { count } = await query.count("* as count").first();
    return count;
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

  baseTenantTotalCount = async (filter, timeInfos, tenantId, dopWhereCall) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.tenantBaseGetQuery(filter, timeInfos, tenantId);

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseOwnerTotalCount = async (filter, timeInfos, ownerId, dopWhereCall) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.ownerBaseGetQuery(filter, timeInfos, ownerId);

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseTenantList = async (props, type) => {
    const { filter, start, count, timeInfos, tenantId } = props;

    const { order, orderType } = this.getOrderInfo(props);

    let query = this.tenantBaseGetQuery(
      filter,
      timeInfos,
      tenantId,
      type == "booking",
      type == "booking"
    );

    if (type == "booking") {
      query = this.dopWhereBooking(query);
    } else {
      query = this.dopWhereOrder(query);
    }

    const visibleFields =
      type == "booking"
        ? [...this.lightRequestVisibleFields, ...this.selectPartPayedInfo]
        : this.lightVisibleFields;

    if (type == "order") {
      query = query.whereNull(`${ORDERS_TABLE}.parent_id`);
    }

    return await query
      .select(visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseOwnerList = async (props, type) => {
    const { filter, start, count, timeInfos, ownerId } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.ownerBaseGetQuery(
      filter,
      timeInfos,
      ownerId,
      type == "booking"
    );

    if (type == "booking") {
      query = this.dopWhereBooking(query);
    } else {
      query = this.dopWhereOrder(query);
    }

    const visibleFields =
      type == "booking"
        ? this.lightRequestVisibleFields
        : this.lightVisibleFields;

    return await query
      .select(visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  dopWhereBooking = (query) =>
    query.whereIn(`${ORDERS_TABLE}.status`, this.bookingStatuses);

  dopWhereOrder = (query) =>
    query.whereNotIn(`${ORDERS_TABLE}.status`, this.bookingStatuses);

  tenantBookingsTotalCount = async (filter, timeInfos, tenantId) => {
    return await this.baseTenantTotalCount(
      filter,
      timeInfos,
      tenantId,
      this.dopWhereBooking
    );
  };

  tenantOrdersTotalCount = async (filter, timeInfos, userId) => {
    return await this.baseTenantTotalCount(
      filter,
      timeInfos,
      userId,
      this.dopWhereOrder
    );
  };

  tenantBookingsList = async (props) => {
    return await this.baseTenantList(props, "booking");
  };

  tenantOrdersList = async (props) => {
    return await this.baseTenantList(props, "order");
  };

  ownerBookingsTotalCount = async (filter, timeInfos, userId) => {
    return await this.baseOwnerTotalCount(
      filter,
      timeInfos,
      userId,
      this.dopWhereBooking
    );
  };

  ownerOrdersTotalCount = async (filter, timeInfos, userId) => {
    return await this.baseOwnerTotalCount(
      filter,
      timeInfos,
      userId,
      this.dopWhereOrder
    );
  };

  ownerBookingsList = async (props) => {
    return await this.baseOwnerList(props, "booking");
  };

  ownerOrderList = async (props) => {
    return await this.baseOwnerList(props, "order");
  };

  allBookingsTotalCount = async (filter, type, timeInfos) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.fullBaseGetQueryWithRequestInfo(filter);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.dopWhereBooking(query);

    query = this.baseQueryListByType(query, type);

    const { count } = await query.count("* as count").first();
    return count;
  };

  allOrdersTotalCount = async (filter, type, timeInfos) => {
    let query = db(ORDERS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    query = this.fullBaseGetQuery(filter);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.dopWhereOrder(query);

    query = this.baseQueryListByType(query, type);

    const { count } = await query.count("* as count").first();
    return count;
  };

  allBookingsList = async (props) => {
    const { filter, start, count, timeInfos, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQueryWithRequestInfo(filter);

    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.dopWhereBooking(query);
    query = query.select(this.lightRequestVisibleFields);
    query = query.orderBy(order, orderType);

    query = this.baseQueryListByType(query, type);

    return await query.limit(count).offset(start);
  };

  allOrderList = async (props) => {
    const { filter, start, count, timeInfos, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQuery(filter);
    query = this.payedInfoJoin(query);
    query = this.orderCreatedTimeFilterWrap(query, timeInfos);

    query = this.dopWhereOrder(query);

    query = this.baseQueryListByType(query, type);

    return await query
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
    message,
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
        message,
        parent_id: orderParentId,
      })
      .returning("id");

    return res[0]["id"];
  };

  fullOrdersJoin = (db) => {
    return db
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
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
  };

  getByWhere = async (key, value) => {
    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);
    query = query.select(this.fullVisibleFields).where(key, value);

    return await query.first();
  };

  getById = (id) => this.getByWhere(`${ORDERS_TABLE}.id`, id);

  getLastActive = async (id) => {
    let lastOrderQuery = db(ORDERS_TABLE);
    lastOrderQuery = this.fullOrdersJoin(lastOrderQuery);

    const lastOrder = await lastOrderQuery
      .select(this.fullVisibleFields)
      .where(`${ORDERS_TABLE}.parent_id`, id)
      .whereIn("status", [
        STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .whereNull("cancel_status")
      .orderBy(`${ORDERS_TABLE}.end_date`, "desc")
      .first();

    if (lastOrder) {
      return lastOrder;
    }

    return await this.getById(id);
  };

  getFullByBaseRequest = async (request) => {
    const order = await request();

    if (order) {
      order["listingImages"] = await listingModel.getListingImages(
        order["listingId"]
      );

      order["defects"] = await listingModel.getDefects(order["listingId"]);

      order["categoryInfo"] =
        await listingCategoryModel.getRecursiveCategoryList(
          order["listingCategoryId"]
        );
    }

    return order;
  };

  getFullById = (id) => this.getFullByBaseRequest(() => this.getById(id));

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
      let startDate = new Date(order["startDate"]);
      let endDate = new Date(order["endDate"]);

      if (order["newStartDate"] && order["newEndDate"]) {
        startDate = new Date(order["newStartDate"]);
        endDate = new Date(order["newEndDate"]);
      }

      const datesBetween = generateDatesBetween(startDate, endDate);
      datesBetween.forEach((date) => (blockedDatesObj[date] = true));
    });

    return Object.keys(blockedDatesObj);
  };

  getBlockedListingsDatesForUser = async (listingIds, userId) => {
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
        this.where(function () {
          this.whereNot("status", STATIC.ORDER_STATUSES.PENDING_OWNER).orWhere(
            "tenant_id",
            userId
          );
        })
          .whereRaw(
            `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}')`
          )
          .whereNot("status", STATIC.ORDER_STATUSES.REJECTED);
      })
      .select([
        "end_date as endDate",
        "start_date as startDate",
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
    return await query
      .whereIn(`${ORDERS_TABLE}.parent_id`, orderIds)
      .select(this.fullVisibleFields);
  };

  getConflictOrders = async (orderIds) => {
    let query = db(`${ORDERS_TABLE} as searching_order`)
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} as searching_order_update_request ON searching_order_update_request.order_id = searching_order.id AND searching_order_update_request.active`
      )
      .join(
        `${ORDERS_TABLE}`,
        `${ORDERS_TABLE}.listing_id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      );
    query = this.fullOrdersJoin(query);
    query = query
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
     ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
      )
      .whereRaw(`${ORDERS_TABLE}.id != searching_order.id`)
      .where(`searching_order.status`, STATIC.ORDER_STATUSES.PENDING_OWNER)
      .whereRaw(`${ORDERS_TABLE}.listing_id = searching_order.listing_id`)
      .whereIn(`searching_order.id`, orderIds)
      .whereRaw(
        `(
          (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND searching_order_update_request.id IS NOT NULL
            AND (
              (
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date >= searching_order_update_request.new_start_date 
                AND 
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date <= searching_order_update_request.new_end_date
              )
              OR
              (
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= searching_order_update_request.new_start_date 
                AND 
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date <= searching_order_update_request.new_end_date
              )
            )
          )
          OR
          (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND searching_order_update_request.id IS NOT NULL
            AND (
              (
                ${ORDERS_TABLE}.start_date >= searching_order_update_request.new_start_date 
                AND 
                ${ORDERS_TABLE}.start_date <= searching_order_update_request.new_end_date
              )
              OR
              (
                ${ORDERS_TABLE}.end_date >= searching_order_update_request.new_start_date 
                AND 
                ${ORDERS_TABLE}.end_date <= searching_order_update_request.new_end_date
              )
            )
          ) 
          OR 
          (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL AND searching_order_update_request.id IS NULL
            AND (
              (
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date >= searching_order.start_date 
                AND 
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date <= searching_order.end_date
              )
              OR
              (
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date >= searching_order.start_date 
                AND 
                ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date <= searching_order.end_date
              )
            )
          )
          OR
          (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL AND searching_order_update_request.id IS NULL
            AND (
              (
                ${ORDERS_TABLE}.start_date >= searching_order.start_date 
                AND 
                ${ORDERS_TABLE}.start_date <= searching_order.end_date
              )
              OR
              (
                ${ORDERS_TABLE}.end_date >= searching_order.start_date 
                AND 
                ${ORDERS_TABLE}.end_date <= searching_order.end_date
              )
            )
          )
        )`
      )
      .whereNot(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.PENDING_OWNER)
      .whereRaw(
        `NOT (${ORDERS_TABLE}.cancel_status IS NOT NULL AND ${ORDERS_TABLE}.cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}')`
      )
      .whereNot(`${ORDERS_TABLE}.status`, STATIC.ORDER_STATUSES.REJECTED);

    const conflictOrders = await query
      .groupBy([
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
        `searching_order.id`,
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
        `${LISTING_CATEGORIES_TABLE}.name`,
        `${LISTINGS_TABLE}.description`,
        `${LISTINGS_TABLE}.rental_terms`,
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
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day`,
      ])
      .select([
        ...this.fullVisibleFields,
        `searching_order.id as searchingOrderId`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
        `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
      ]);

    const res = {};

    orderIds.forEach((orderId) => {
      const currentOrderConflicts = [];

      conflictOrders.forEach((conflict) => {
        if (conflict.searchingOrderId == orderId) {
          currentOrderConflicts.push(conflict);
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
    await db(ORDERS_TABLE)
      .where("id", id)
      .update("status", STATIC.ORDER_STATUSES.PENDING_TENANT);
  };

  setPendingOwnerStatus = async (id) => {
    await db(ORDERS_TABLE)
      .where("id", id)
      .update("status", STATIC.ORDER_STATUSES.PENDING_OWNER);
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

    await db(ORDERS_TABLE).where("id", orderId).update(updateProps);
  };

  acceptUpdateRequest = (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  acceptOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT;
    return this.updateOrder(orderId, newData);
  };

  rejectOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.REJECTED;
    return this.updateOrder(orderId, newData);
  };

  startCancelByOwner = async (orderId) => {
    await db(ORDERS_TABLE).where("id", orderId).update({
      cancel_status: STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE,
    });
  };

  startCancelByTenant = async (orderId) => {
    await db(ORDERS_TABLE).where("id", orderId).update({
      cancel_status: STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE,
    });
  };

  needAdminCancel = async (orderId) => {
    await db(ORDERS_TABLE).where("id", orderId).update({
      cancel_status: STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE,
    });
  };

  successCancelled = async (orderId, newData = {}) => {
    await db(ORDERS_TABLE)
      .where("id", orderId)
      .update({ cancel_status: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED });
  };

  getUnfinishedTenantCount = async (tenantId) => {
    const { count } = await db(ORDERS_TABLE)
      .whereIn("status", this.processStatuses)
      .whereNull("cancel_status")
      .where("tenant_id", tenantId)
      .count("* as count")
      .first();

    return count;
  };

  getUnfinishedOwnerCount = async (ownerId) => {
    const { count } = await db(ORDERS_TABLE)
      .whereIn("status", this.processStatuses)
      .whereNull("cancel_status")
      .leftJoin(
        LISTINGS_TABLE,
        LISTINGS_TABLE + ".id",
        ORDERS_TABLE + ".listing_id"
      )
      .where(LISTINGS_TABLE + ".owner_id", ownerId)
      .count("* as count")
      .first();

    return count;
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
    const { count } = await db(ORDERS_TABLE)
      .whereIn("status", this.processStatuses)
      .where("listing_id", listingId)
      .count("* as count")
      .first();

    return +count;
  };

  delete = async (orderId) => {
    await db(STATIC.RECIPIENT_STATUSES).where("order_id", orderId).delete();
    await db(SENDER_PAYMENTS_TABLE).where("order_id", orderId).delete();
    await db(ORDER_UPDATE_REQUESTS_TABLE).where("order_id", orderId).delete();
    await db(ORDERS_TABLE).where("id", orderId).delete();
  };

  orderTenantPayed = async (orderId, { token, qrCode }) => {
    await db(ORDERS_TABLE).where({ id: orderId }).update({
      tenant_accept_listing_token: token,
      tenant_accept_listing_qrcode: qrCode,
      status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
    });
  };

  orderTenantGotListing = async (orderId, { token, qrCode }) => {
    await db(ORDERS_TABLE).where({ id: orderId }).update({
      owner_accept_listing_token: token,
      owner_accept_listing_qrcode: qrCode,
      status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
    });
  };

  orderFinished = async (token) => {
    await db(ORDERS_TABLE)
      .where({ owner_accept_listing_token: token })
      .update({
        status: STATIC.ORDER_STATUSES.FINISHED,
        finished_at: db.raw("CURRENT_TIMESTAMP"),
      });
  };

  generateDefectQuestionList = async ({ questionInfos, type, orderId }) => {
    const toInsert = [];

    questionInfos.forEach((questionInfo) =>
      toInsert.push({
        question: questionInfo.question,
        answer: questionInfo.answer,
        description: questionInfo.description,
        type,
        order_id: orderId,
      })
    );

    if (questionInfos.length > 0) {
      await db.batchInsert(LISTING_DEFECT_QUESTION_RELATIONS_TABLE, toInsert);
    }
  };

  generateDefectFromOwnerQuestionList = (questionInfos, orderId) =>
    this.generateDefectQuestionList({ questionInfos, orderId, type: "owner" });

  generateDefectFromTenantQuestionList = (questionInfos, orderId) =>
    this.generateDefectQuestionList({ questionInfos, orderId, type: "tenant" });

  getUserTotalCountOrders = async (userId) => {
    const resultSelect = await db(ORDERS_TABLE)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .select(db.raw("COUNT(*) as count"))
      .where(function () {
        this.where(`${LISTINGS_TABLE}.owner_id`, userId);
        /*.orWhere(
          `${ORDERS_TABLE}.tenant_id`,
          userId
        );*/
      })
      .whereIn("status", [
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
        STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        STATIC.ORDER_STATUSES.FINISHED,
      ])
      .first();
    return resultSelect.count ?? 0;
  };

  updateExtendedFinished = async () => {
    return await db(ORDERS_TABLE)
      .whereIn("id", function () {
        this.select("parent_id").from(ORDERS_TABLE).whereNotNull("parent_id");
      })
      .whereNull("cancel_status")
      .where("status", STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER)
      .whereRaw(`end_date < TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')`)
      .update({ status: STATIC.ORDER_STATUSES.FINISHED });
  };

  getInUseListings = async (dateStart, dateEnd) => {
    return await db(ORDERS_TABLE)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .whereIn("status", [
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

  getBookingStatusesCount = async ({ timeInfos, filter }) => {
    let query = db(ORDERS_TABLE);
    query = query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );

    query = this.orderCreatedTimeFilterWrap(query, timeInfos);
    query = query.whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    const result = await query
      .whereIn("status", this.bookingStatuses)
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}' 
            AND ${ORDERS_TABLE}.cancel_status IS NULL
            THEN 1 ELSE 0 END) AS "rejectedCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}' 
            THEN 1 ELSE 0 END) AS "canceledCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT}' 
            AND ${ORDERS_TABLE}.cancel_status IS NULL
            THEN 1 ELSE 0 END) AS "acceptedCount"`
        )
      )
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      rejectedCount: result["rejectedCount"] ?? 0,
      canceledCount: result["canceledCount"] ?? 0,
      acceptedCount: result["acceptedCount"] ?? 0,
    };
  };

  getOrderStatusesCount = async ({ timeInfos, filter }) => {
    let query = db(ORDERS_TABLE);
    query = query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );

    query = this.orderCreatedTimeFilterWrap(query, timeInfos);
    query = query.whereRaw(
      this.filterIdLikeString(filter, `${ORDERS_TABLE}.id`)
    );

    const result = await query
      .whereNotIn("status", this.bookingStatuses)
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.FINISHED}' 
            AND ${ORDERS_TABLE}.cancel_status IS NULL
            THEN 1 ELSE 0 END) AS "finishedCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}' 
            THEN 1 ELSE 0 END) AS "canceledCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.cancel_status IS NOT NULL
            AND ${ORDERS_TABLE}.cancel_status != '${STATIC.ORDER_CANCELATION_STATUSES.CANCELLED}' 
            THEN 1 ELSE 0 END) AS "disputeCount"`
        ),
        db.raw(
          `SUM(CASE 
            WHEN ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.FINISHED}' 
            AND ${ORDERS_TABLE}.cancel_status IS NULL
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

  orderCheckListByIds = async (ids) => {
    const checkLists = {};
    ids.forEach((id) => (checkLists[id] = []));

    const requestResult = await db(LISTING_DEFECT_QUESTION_RELATIONS_TABLE)
      .where("type", "tenant")
      .whereIn("order_id", ids)
      .where("answer", true)
      .select("question", `order_id as orderId`);

    requestResult.forEach((request) =>
      checkLists[request.orderId].push(request.question)
    );

    return checkLists;
  };
}

module.exports = new OrderModel();
