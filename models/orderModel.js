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
const listingCategoriesModel = require("./listingCategoriesModel");

const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const ORDER_UPDATE_REQUESTS_TABLE = STATIC.TABLES.ORDER_UPDATE_REQUESTS;

class OrderModel extends Model {
  lightVisibleFields = [
    `${ORDERS_TABLE}.id`,
    `${ORDERS_TABLE}.status`,
    `${ORDERS_TABLE}.cancel_status as cancelStatus`,
    `${ORDERS_TABLE}.price_per_day as offerPricePerDay`,
    `${ORDERS_TABLE}.start_date as offerStartDate`,
    `${ORDERS_TABLE}.end_date as offerEndDate`,
    `${ORDERS_TABLE}.duration`,
    `${ORDERS_TABLE}.fee`,
    `${ORDERS_TABLE}.fact_total_price as factTotalPrice`,
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
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
  ];

  lightRequestVisibleFields = [
    ...this.lightVisibleFields,
    `${ORDER_UPDATE_REQUESTS_TABLE}.id as requestId`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
    `${ORDER_UPDATE_REQUESTS_TABLE}.fact_total_price as requestFactTotalPrice`,
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
    `${LISTINGS_TABLE}.count_stored_items as listingCountStoredItems`,
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
    `${ORDERS_TABLE}.fact_total_price`,
    `tenants.name`,
    `tenants.email`,
    `owners.name`,
    `owners.email`,
    `${LISTINGS_TABLE}.name`,

    `duration`,
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
    quickCancelLastPossible.setDate(quickCancelLastPossible.getDate() - 1);

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

  fullBaseGetQuery = (filter, serverFromTime, serverToTime) => {
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
      .whereRaw(...this.baseStrFilter(filter));

    if (serverFromTime) {
      query = query.where(
        "start_date",
        ">=",
        formatDateToSQLFormat(serverFromTime)
      );
    }

    if (serverToTime) {
      query = query.where(
        "end_date",
        "<=",
        formatDateToSQLFormat(serverToTime)
      );
    }

    return query;
  };

  fullBaseGetQueryWithRequestInfo = (filter, serverFromTime, serverToTime) => {
    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    return query.joinRaw(
      `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
       ${ORDER_UPDATE_REQUESTS_TABLE}.order_id = ${ORDERS_TABLE}.id
        AND ${ORDER_UPDATE_REQUESTS_TABLE}.active = true`
    );
  };

  tenantBaseGetQuery = (
    filter,
    serverFromTime,
    serverToTime,
    tenantId,
    needRequestInfo = false
  ) => {
    const baseGetReq = needRequestInfo
      ? this.fullBaseGetQueryWithRequestInfo
      : this.fullBaseGetQuery;
    let query = baseGetReq(filter, serverFromTime, serverToTime);
    return query.whereRaw("tenants.id = ?", tenantId);
  };

  ownerBaseGetQuery = (
    filter,
    serverFromTime,
    serverToTime,
    ownerId,
    needRequestInfo = false
  ) => {
    const baseGetReq = needRequestInfo
      ? this.fullBaseGetQueryWithRequestInfo
      : this.fullBaseGetQuery;
    let query = baseGetReq(filter, serverFromTime, serverToTime);
    return query.whereRaw("owners.id = ?", ownerId);
  };

  fullTotalCount = async (filter, serverFromTime, serverToTime) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    const { count } = await query.count("* as count").first();
    return count;
  };

  fullList = async (props) => {
    const { filter, start, count, serverFromTime, serverToTime } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseTenantTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    tenantId,
    dopWhereCall
  ) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.tenantBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      tenantId
    );

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseOwnerTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    ownerId,
    dopWhereCall
  ) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.ownerBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      ownerId
    );

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseWithRequestInfoTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    dopWhereCall
  ) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseAllTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    dopWhereCall
  ) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    query = dopWhereCall(query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  baseTenantList = async (props, type) => {
    const { filter, start, count, serverFromTime, serverToTime, tenantId } =
      props;

    const { order, orderType } = this.getOrderInfo(props);

    let query = this.tenantBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      tenantId,
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

  baseOwnerList = async (props, type) => {
    const { filter, start, count, serverFromTime, serverToTime, ownerId } =
      props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.ownerBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
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

  baseAllList = async (props, dopWhereCall) => {
    const { filter, start, count, serverFromTime, serverToTime } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);

    query = dopWhereCall(query);

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseWithRequestInfoList = async (props, dopWhereCall) => {
    const { filter, start, count, serverFromTime, serverToTime } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.fullBaseGetQueryWithRequestInfo(
      filter,
      serverFromTime,
      serverToTime
    );

    query = dopWhereCall(query);

    query = query.select(this.lightRequestVisibleFields);

    if (order == "fact_total_price") {
      query = query.orderByRaw(
        `CASE WHEN ${ORDER_UPDATE_REQUESTS_TABLE}.fact_total_price IS NULL 
        THEN ${ORDERS_TABLE}.fact_total_price ELSE ${ORDER_UPDATE_REQUESTS_TABLE}.fact_total_price END`
      );
    } else {
      query = query.orderBy(order, orderType);
    }

    return await query.limit(count).offset(start);
  };

  dopWhereBooking = (query) =>
    query.whereIn(`${ORDERS_TABLE}.status`, this.bookingStatuses);

  dopWhereOrder = (query) =>
    query.whereNotIn(`${ORDERS_TABLE}.status`, this.bookingStatuses);

  tenantBookingsTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    tenantId
  ) => {
    return await this.baseTenantTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      tenantId,
      this.dopWhereBooking
    );
  };

  tenantOrdersTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId
  ) => {
    return await this.baseTenantTotalCount(
      filter,
      serverFromTime,
      serverToTime,
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

  ownerBookingsTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId
  ) => {
    return await this.baseOwnerTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      userId,
      this.dopWhereBooking
    );
  };

  ownerOrdersTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId
  ) => {
    return await this.baseOwnerTotalCount(
      filter,
      serverFromTime,
      serverToTime,
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

  allBookingsTotalCount = async (filter, serverFromTime, serverToTime) => {
    return await this.baseWithRequestInfoTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      this.dopWhereBooking
    );
  };

  allOrdersTotalCount = async (filter, serverFromTime, serverToTime) => {
    return await this.baseAllTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      this.dopWhereOrder
    );
  };

  allBookingsList = async (props) => {
    return await this.baseWithRequestInfoList(props, this.dopWhereBooking);
  };

  allOrderList = async (props) => {
    return await this.baseAllList(props, this.dopWhereOrder);
  };

  create = async ({
    pricePerDay,
    startDate,
    endDate,
    listingId,
    tenantId,
    fee,
  }) => {
    const duration = getDaysDifference(startDate, endDate);
    const factTotalPrice = (duration * pricePerDay * (100 + fee)) / 100;

    const res = await db(ORDERS_TABLE)
      .insert({
        price_per_day: pricePerDay,
        start_date: startDate,
        end_date: endDate,
        listing_id: listingId,
        tenant_id: tenantId,
        fee,
        duration,
        fact_total_price: factTotalPrice,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        tenant_accept_listing_qrcode: "",
        owner_accept_listing_qrcode: "",
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

  getFullByBaseRequest = async (request) => {
    const order = await request();

    if (order) {
      order["listingImages"] = await listingModel.getListingImages(
        order["listingId"]
      );
      order["categoryInfo"] =
        await listingCategoriesModel.getRecursiveCategoryList(
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
      const startDate = new Date(order["startDate"]);
      const endDate = new Date(order["endDate"]);
      const datesBetween = generateDatesBetween(startDate, endDate);
      datesBetween.forEach((date) => (blockedDatesObj[date] = true));
    });

    return Object.keys(blockedDatesObj);
  };

  getBlockedListingDatesForUser = async (listingId, userId) => {
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
      .where(function () {
        this.where(function () {
          this.whereNot("status", STATIC.ORDER_STATUSES.PENDING_OWNER).orWhere(
            "tenant_id",
            userId
          );
        })
          .whereRaw(
            `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELED}')`
          )
          .whereNot("status", STATIC.ORDER_STATUSES.REJECTED);
      })
      .select(["end_date as endDate", "start_date as startDate"]);

    return this.generateBlockedDatesByOrders(orders);
  };

  getConflictOrders = async (orderId, listingId, startDate, endDate) => {
    let query = db(ORDERS_TABLE);
    query = this.fullOrdersJoin(query);
    query = query
      .joinRaw(
        `LEFT JOIN ${ORDER_UPDATE_REQUESTS_TABLE} ON
     ${ORDERS_TABLE}.id = ${ORDER_UPDATE_REQUESTS_TABLE}.order_id AND ${ORDER_UPDATE_REQUESTS_TABLE}.active`
      )
      .where("listing_id", listingId)
      .whereNot(`${ORDERS_TABLE}.id`, orderId)
      .whereRaw(
        `(
        (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NOT NULL 
          AND (
            (${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date >= ? AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date <= ?)
            OR
            (${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date >= ? AND ${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date <= ?)
          )
        )
        OR
        (${ORDER_UPDATE_REQUESTS_TABLE}.id IS NULL 
          AND (
            (${ORDERS_TABLE}.start_date >= ? AND ${ORDERS_TABLE}.end_date <= ?)
            OR
            (${ORDERS_TABLE}.start_date >= ? AND ${ORDERS_TABLE}.end_date <= ?)
          )
        )
      )`,
        [
          startDate,
          startDate,
          endDate,
          endDate,
          startDate,
          startDate,
          endDate,
          endDate,
        ]
      )
      .whereNot("status", STATIC.ORDER_STATUSES.PENDING_OWNER)
      .whereRaw(
        `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELED}')`
      )
      .whereNot("status", STATIC.ORDER_STATUSES.REJECTED);

    return await query.select([
      ...this.fullVisibleFields,
      `${ORDER_UPDATE_REQUESTS_TABLE}.new_start_date as newStartDate`,
      `${ORDER_UPDATE_REQUESTS_TABLE}.new_end_date as newEndDate`,
      `${ORDER_UPDATE_REQUESTS_TABLE}.new_price_per_day as newPricePerDay`,
      `${ORDER_UPDATE_REQUESTS_TABLE}.fact_total_price as newFactTotalPrice`,
    ]);
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
        `NOT (cancel_status IS NOT NULL AND cancel_status = '${STATIC.ORDER_CANCELATION_STATUSES.CANCELED}')`
      )
      .whereNot("status", STATIC.ORDER_STATUSES.REJECTED)
      .select(["end_date as endDate", "start_date as startDate"]);

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
    { newStartDate, newEndDate, newPricePerDay, status = null }
  ) => {
    const updateProps = {
      start_date: newStartDate,
      end_date: newEndDate,
      price_per_day: newPricePerDay,
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
    await db(ORDERS_TABLE).where("id", orderId).update(newData);
  };

  rejectOrder = async (orderId, newData = {}) => {
    newData["status"] = STATIC.ORDER_STATUSES.REJECTED;
    await db(ORDERS_TABLE).where("id", orderId).update(newData);
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

  successCanceled = async (orderId, newData = {}) => {
    await db(ORDERS_TABLE)
      .where("id", orderId)
      .update({ cancel_status: STATIC.ORDER_CANCELATION_STATUSES.CANCELED });
  };

  getUnfinishedTenantCount = async (tenantId) => {
    const { count } = await db(ORDERS_TABLE)
      .whereIn("status", this.processStatuses)
      .where("tenant_id", tenantId)
      .count("* as count")
      .first();

    return count;
  };

  getUnfinishedOwnerCount = async (ownerId) => {
    const { count } = await db(ORDERS_TABLE)
      .whereIn("status", this.processStatuses)
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
    await db(ORDERS_TABLE).where({ owner_accept_listing_token: token }).update({
      status: STATIC.ORDER_STATUSES.FINISHED,
    });
  };
}

module.exports = new OrderModel();
