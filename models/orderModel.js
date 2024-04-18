require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const {
  getDaysDifference,
  separateDate,
  generateDatesBetween,
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

  fullBaseGetQuery = async (filter, serverFromTime, serverToTime) => {
    let query = db(ORDERS_TABLE)
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

  tenantBaseGetQuery = async (
    filter,
    serverFromTime,
    serverToTime,
    tenantId
  ) => {
    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);
    return query.where("tenants.id", tenantId);
  };

  ownerBaseGetQuery = (filter, serverFromTime, serverToTime, ownerId) => {
    let query = this.fullBaseGetQuery(filter, serverFromTime, serverToTime);
    return query.where("owners.id", ownerId);
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

  tenantTotalCount = async (filter, serverFromTime, serverToTime, userId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.tenantBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      userId
    );

    const { count } = await query.count("* as count").first();
    return count;
  };

  tenantList = async (props) => {
    const { filter, start, count, serverFromTime, serverToTime, userId } =
      props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.tenantBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      userId
    );

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  ownerTotalCount = async (filter, serverFromTime, serverToTime, userId) => {
    let query = db(ORDERS_TABLE).whereRaw(
      ...this.baseStrFilter(filter, this.strFilterFields)
    );

    query = this.ownerBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      userId
    );

    const { count } = await query.count("* as count").first();
    return count;
  };

  ownerList = async (props) => {
    const { filter, start, count, serverFromTime, serverToTime, userId } =
      props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.ownerBaseGetQuery(
      filter,
      serverFromTime,
      serverToTime,
      userId
    );

    return await query
      .select(this.lightVisibleFields)
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

  getFullById = async (id) => {
    const order = await db(ORDERS_TABLE)
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
      )
      .select(this.fullVisibleFields)
      .where(`${ORDERS_TABLE}.id`, id)
      .first();

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
}

module.exports = new OrderModel();
