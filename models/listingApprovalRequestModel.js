require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LISTING_APPROVAL_REQUESTS_TABLE = STATIC.TABLES.LISTING_APPROVAL_REQUESTS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;

class ListingApprovalRequestModel extends Model {
  visibleFields = [
    `${LISTING_APPROVAL_REQUESTS_TABLE}.id`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${LISTINGS_TABLE}.address`,
    `${LISTINGS_TABLE}.price_per_day as pricePerDay`,
    `${LISTINGS_TABLE}.count_stored_items as countStoredItems`,
    `${LISTINGS_TABLE}.min_rental_days as minRentalDays`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.email as userEmail`,
    `${USERS_TABLE}.phone as userPhone`,
    `${USERS_TABLE}.photo as userPhoto`,
    `${USERS_TABLE}.id as userId`,
    `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
    `${LISTINGS_TABLE}.category_id as categoryId`,
    `${LISTINGS_TABLE}.other_category as otherCategory`,
    `${LISTING_APPROVAL_REQUESTS_TABLE}.approved as approved`,
    `${LISTING_APPROVAL_REQUESTS_TABLE}.created_at as createdAt`,
  ];

  strFilterFields = [
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${USERS_TABLE}.name`,
    `${LISTING_CATEGORIES_TABLE}.name`,
  ];

  orderFields = [
    `${LISTING_APPROVAL_REQUESTS_TABLE}.id`,
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${USERS_TABLE}.name`,
    `${LISTING_CATEGORIES_TABLE}.name`,
  ];

  create = async (listingId) => {
    const res = await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .insert({
        listing_id: listingId,
      })
      .returning("id");

    return res[0]["id"];
  };

  approve = async (listingId) => {
    await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .where({
        listing_id: listingId,
      })
      .whereNull("approved")
      .update({ approved: true });
  };

  deleteByListing = async (listingId) => {
    await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .where({
        listing_id: listingId,
      })
      .delete();
  };

  rejectApprove = async (listingId, rejectDescription) => {
    await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .where({
        listing_id: listingId,
      })
      .whereNull("approved")
      .update({ approved: false, reject_description: rejectDescription });
  };

  queryByStatus = (query, status) => {
    if (status == "approved") {
      query = query.where(`${LISTING_APPROVAL_REQUESTS_TABLE}.approved`, true);
    }

    if (status == "rejected") {
      query = query.where(`${LISTING_APPROVAL_REQUESTS_TABLE}.approved`, false);
    }

    if (status == "waiting") {
      query = query.whereNull(`${LISTING_APPROVAL_REQUESTS_TABLE}.approved`);
    }

    return query;
  };

  baseListJoin = (query) =>
    query
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${LISTING_APPROVAL_REQUESTS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .leftJoin(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      );

  totalCount = async (filter, timeInfos, userId = null, status) => {
    let query = db(LISTING_APPROVAL_REQUESTS_TABLE);
    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${LISTING_APPROVAL_REQUESTS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${LISTING_APPROVAL_REQUESTS_TABLE}.created_at`
    );

    query = this.queryByStatus(query, status);

    if (userId) {
      query = query.where({ owner_id: userId });
    }

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const { filter, start, count, status } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(LISTING_APPROVAL_REQUESTS_TABLE).select(this.visibleFields);
    query = this.baseListJoin(query).whereRaw(
      this.filterIdLikeString(filter, `${LISTING_APPROVAL_REQUESTS_TABLE}.id`)
    );

    query = this.queryByStatus(query, status);

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${LISTING_APPROVAL_REQUESTS_TABLE}.created_at`
    );

    if (props.userId) {
      query = query.where({ owner_id: props.userId });
    }

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  notViewedByAdminRequest = async (listingId) => {
    const listing = await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .where({
        listing_id: listingId,
      })
      .whereNull("approved")
      .first();
    return listing;
  };

  hasNotViewedByAdminRequest = async (listingId) => {
    const notViewedByAdminRequest = await this.notViewedByAdminRequest(
      listingId
    );
    return !!notViewedByAdminRequest;
  };

  baseGetByField = async (field, value) => {
    const lastRequestInfo = await db(LISTING_APPROVAL_REQUESTS_TABLE)
      .select([
        "id",
        "listing_id as listingId",
        "reject_description as rejectDescription",
        "approved",
      ])
      .where(field, value)
      .orderBy("id", "desc")
      .first();

    return lastRequestInfo;
  };

  lastListingApprovalRequestInfo = async (listingId) => {
    const request = await this.baseGetByField("listing_id", listingId);
    return request ?? {};
  };

  getById = async (requestId) => {
    const request = await this.baseGetByField("id", requestId);
    return request ?? {};
  };
}

module.exports = new ListingApprovalRequestModel();
