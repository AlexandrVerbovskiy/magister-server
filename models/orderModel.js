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
    `owners.id as ownerId`,
    `owners.name as ownerName`,
    `owners.email as ownerEmail`,
    `owners.photo as ownerPhoto`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.price_per_day as listingPricePerDay`,
    `${LISTINGS_TABLE}.min_rental_days as listingMinRentalDays`,
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
  ];

  fullVisibleFields = [
    ...this.lightVisibleFields,
    `${LISTINGS_TABLE}.description as listingDescription`,
    `${LISTINGS_TABLE}.rental_terms as listingRentalTerms`,
    `${LISTINGS_TABLE}.address as listingAddress`,
    `${LISTINGS_TABLE}.postcode as listingPostcode`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `${LISTINGS_TABLE}.rental_lat as listingRentalLat`,
    `${LISTINGS_TABLE}.rental_lng as listingRentalLng`,
    `${LISTINGS_TABLE}.rental_radius as listingRentalRadius`,
    `${LISTINGS_TABLE}.compensation_cost as compensationCost`,
    `${LISTINGS_TABLE}.count_stored_items as listingCountStoredItems`,
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
      `LEFT JOIN ${STATIC.TABLES.ORDER_UPDATE_REQUESTS} ON
       ${STATIC.TABLES.ORDER_UPDATE_REQUESTS}.order_id = ${STATIC.TABLES.ORDERS}.id
        AND ${STATIC.TABLES.ORDER_UPDATE_REQUESTS}.active = true`
    );
  };

  tenantBaseGetQuery = (filter, serverFromTime, serverToTime, tenantId) => {
    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);
    return query.whereRaw("tenants.id = ?", tenantId);
  };

  ownerBaseGetQuery = (filter, serverFromTime, serverToTime, ownerId) => {
    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);
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

    query = this.fullBaseGetQueryWithRequestInfo(
      filter,
      serverFromTime,
      serverToTime
    );

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

  baseTenantList = async (props, dopWhereCall) => {
    const { filter, start, count, serverFromTime, serverToTime, tenantId } =
      props;

    const { order, orderType } = this.getOrderInfo(props);

    let query = this.tenantBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      tenantId
    );

    query = dopWhereCall(query);

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  baseOwnerList = async (props, dopWhereCall) => {
    const { filter, start, count, serverFromTime, serverToTime, ownerId } =
      props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.ownerBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      ownerId
    );

    query = dopWhereCall(query);

    return await query
      .select(this.lightVisibleFields)
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

    query = query.select([
      ...this.lightVisibleFields,
      `${STATIC.TABLES.ORDER_UPDATE_REQUESTS}.fact_total_price as requestFactTotalPrice`,
    ]);

    if (order == "fact_total_price") {
      query = query.orderByRaw(
        `CASE WHEN ${STATIC.TABLES.ORDER_UPDATE_REQUESTS}.fact_total_price IS NULL 
        THEN ${STATIC.TABLES.ORDERS}.fact_total_price ELSE ${STATIC.TABLES.ORDER_UPDATE_REQUESTS}.fact_total_price END`
      );
    } else {
      query = query.orderBy(order, orderType);
    }

    return await query.limit(count).offset(start);
  };

  tenantBookingsTotalCount = (
    filter,
    serverFromTime,
    serverToTime,
    tenantId
  ) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseTenantTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      tenantId,
      dopWhereCall
    );
  };

  tenantOrdersTotalCount = (filter, serverFromTime, serverToTime, userId) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseTenantTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      userId,
      dopWhereCall
    );
  };

  tenantBookingsList = (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
        ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
        ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
        ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
      )`
      );

    return this.baseTenantList(props, dopWhereCall);
  };

  tenantOrdersList = async (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
        ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
        ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
        ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
      )`
      );

    return this.baseTenantList(props, dopWhereCall);
  };

  ownerBookingsTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId
  ) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseOwnerTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      userId,
      dopWhereCall
    );
  };

  ownerOrdersTotalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId
  ) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseOwnerTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      userId,
      dopWhereCall
    );
  };

  ownerBookingsList = async (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseOwnerList(props, dopWhereCall);
  };

  ownerOrderList = async (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseOwnerList(props, dopWhereCall);
  };

  allBookingsTotalCount = async (filter, serverFromTime, serverToTime) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseWithRequestInfoTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      dopWhereCall
    );
  };

  allOrdersTotalCount = async (filter, serverFromTime, serverToTime) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseAllTotalCount(
      filter,
      serverFromTime,
      serverToTime,
      dopWhereCall
    );
  };

  allBookingsList = async (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_OWNER}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.PENDING_TENANT}' OR 
          ${ORDERS_TABLE}.status = '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseWithRequestInfoList(props, dopWhereCall);
  };

  allOrderList = async (props) => {
    const dopWhereCall = (query) =>
      query.whereRaw(
        `(
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_OWNER}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.PENDING_TENANT}' AND 
          ${ORDERS_TABLE}.status != '${STATIC.ORDER_STATUSES.REJECTED}'
        )`
      );

    return this.baseAllList(props, dopWhereCall);
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
      })
      .returning("id");

    return res[0]["id"];
  };

  getById = async (id) => {
    const order = await db(ORDERS_TABLE)
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
      .select(this.fullVisibleFields)
      .where(`${ORDERS_TABLE}.id`, id)
      .first();

    return order;
  };

  getFullById = async (id) => {
    const order = await this.getById(id);

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
      .where("listing_id", listingId)
      .whereRaw("end_date >= ?", [currentDate])
      .where(function () {
        this.whereNot("status", "pending_owner")
          .andWhereNot("status", "pending_tenant")
          .orWhere("tenant_id", userId);
      })
      .select(["end_date as endDate", "start_date as startDate"]);

    return this.generateBlockedDatesByOrders(orders);
  };

  getBlockedListingDates = async (listingId) => {
    const currentDate = separateDate(new Date());

    const orders = await db(ORDERS_TABLE)
      .where("listing_id", listingId)
      .whereRaw("end_date >= ?", [currentDate])
      .whereNot("status", "pending_owner")
      .whereNot("status", "pending_tenant")
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

  updateOrder = async ({
    orderId,
    newStartDate,
    newEndDate,
    newPricePerDay,
    status = null,
  }) => {
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

  acceptUpdateRequest = ({
    orderId,
    newStartDate,
    newEndDate,
    newPricePerDay,
  }) =>
    updateOrder({
      orderId,
      newStartDate,
      newEndDate,
      newPricePerDay,
      status: STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
    });

  acceptOrder = async (orderId) => {
    await db(ORDERS_TABLE)
      .where("id", orderId)
      .update({ status: STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT });
  };

  rejectOrder = async (orderId) => {
    await db(ORDERS_TABLE)
      .where("id", orderId)
      .update({ status: STATIC.ORDER_STATUSES.REJECTED });
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

  successCanceled = async (orderId) => {
    await db(ORDERS_TABLE)
      .where("id", orderId)
      .update({ cancel_status: STATIC.ORDER_CANCELATION_STATUSES.CANCELED });
  };
}

module.exports = new OrderModel();
