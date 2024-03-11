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
    `${LISTINGS_TABLE}.name`,
    `${LISTINGS_TABLE}.city`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.id as userId`,
    `${LISTING_CATEGORIES_TABLE}.name as categoryName`,
    `${LISTING_CATEGORIES_TABLE}.id as categoryId`,
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

    await db(LISTINGS_TABLE)
      .where({
        id: listingId,
      })
      .update({ approved: true });
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

    if (status == "unapproved") {
      query = query.where(`${LISTING_APPROVAL_REQUESTS_TABLE}.approved`, false);
    }

    if (status == "not_processed") {
      query = query.whereNull(`${LISTING_APPROVAL_REQUESTS_TABLE}.approved`);
    }

    return query;
  };

  totalCount = async (
    filter,
    serverFromTime,
    serverToTime,
    userId = null,
    status = "all"
  ) => {
    let query = db(LISTING_APPROVAL_REQUESTS_TABLE)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${LISTING_APPROVAL_REQUESTS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      { serverFromTime, serverToTime },
      query,
      `${LISTING_APPROVAL_REQUESTS_TABLE}.created_at`
    );

    query = this.queryByStatus(query, status);

    if (userId) {
      query = query.where({ owner_id: userId });
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    const { status = "all" } = props;

    let query = db(LISTING_APPROVAL_REQUESTS_TABLE)
      .select(this.visibleFields)
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${LISTING_APPROVAL_REQUESTS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .whereRaw(...this.baseStrFilter(filter));

    query = this.queryByStatus(query, status);

    query = this.baseListTimeFilter(
      props,
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