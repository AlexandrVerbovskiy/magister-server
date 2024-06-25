const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const DISPUTES_TABLE = STATIC.TABLES.DISPUTES;
const USERS_TABLE = STATIC.TABLES.USERS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
class DisputeModel extends Model {
  lightVisibleFields = [
    `${DISPUTES_TABLE}.id`,
    `${DISPUTES_TABLE}.description as description`,
    `${DISPUTES_TABLE}.solution as solution`,
    `${DISPUTES_TABLE}.type as type`,
    `${DISPUTES_TABLE}.status as status`,
    `${DISPUTES_TABLE}.sender_id as senderId`,
    `${DISPUTES_TABLE}.created_at as createdAt`,
    `${ORDERS_TABLE}.id as orderId`,
    `${ORDERS_TABLE}.status as orderStatus`,
    `${ORDERS_TABLE}.cancel_status as orderCancelStatus`,
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

  orderFields = [
    `${DISPUTES_TABLE}.id`,
    `owners.name`,
    `tenants.name`,
    `${LISTINGS_TABLE}.name`,
    `${ORDERS_TABLE}.start_date`,
    `${ORDERS_TABLE}.end_date`,
    `${DISPUTES_TABLE}.created_at`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`, `tenants.name`, `owners.name`];

  baseListJoin = (query) =>
    query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${DISPUTES_TABLE}.order_id`
      )
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

  create = async ({ description, type, senderId, orderId }) => {
    const res = await db(DISPUTES_TABLE)
      .insert({
        type,
        description,
        sender_id: senderId,
        order_id: orderId,
        solution: "",
        status: STATIC.DISPUTE_STATUSES.OPEN,
      })
      .returning("id");

    return res[0]["id"];
  };

  solve = async (solution, disputeId) => {
    await db(DISPUTES_TABLE).where("id", disputeId).update({
      solution,
      status: STATIC.DISPUTE_STATUSES.SOLVED,
    });
  };

  unsolve = async (disputeId) => {
    await db(DISPUTES_TABLE).where("id", disputeId).update({
      status: STATIC.DISPUTE_STATUSES.UNSOLVED,
    });
  };

  baseTypeWhere = (type, query) => {
    if (type === STATIC.DISPUTE_STATUSES.OPEN) {
      query = query.where(
        `${DISPUTES_TABLE}.status`,
        STATIC.DISPUTE_STATUSES.OPEN
      );
    }

    if (type === STATIC.DISPUTE_STATUSES.UNSOLVED) {
      query = query.where(
        `${DISPUTES_TABLE}.status`,
        STATIC.DISPUTE_STATUSES.UNSOLVED
      );
    }

    if (type === STATIC.DISPUTE_STATUSES.SOLVED) {
      query = query.where(
        `${DISPUTES_TABLE}.status`,
        STATIC.DISPUTE_STATUSES.SOLVED
      );
    }

    return query;
  };

  getById = async(id) => {
    let query = db(DISPUTES_TABLE);
    query = this.fullOrdersJoin(query);
    query = query.select(this.visibleFields).where(`${DISPUTES_TABLE}.id`, id);
    return await query.first();
  };

  totalCount = async ({ filter, timeInfos, type = null }) => {
    let query = db(DISPUTES_TABLE).whereRaw(...this.baseStrFilter(filter));

    query = this.baseListJoin(query);
    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${DISPUTES_TABLE}.created_at`
    );
    query = this.baseTypeWhere(type, query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count, timeInfos, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(DISPUTES_TABLE).whereRaw(...this.baseStrFilter(filter));
    query = this.baseListJoin(query);
    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${DISPUTES_TABLE}.created_at`
    );
    query = this.baseTypeWhere(type, query);

    return await query
      .select(this.lightVisibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  bindEntitiesCounts = async (
    entities,
    key,
    searchField,
    resField = "disputes"
  ) => {
    const ids = entities.map((entity) => entity[key]);

    let query = db(DISPUTES_TABLE);
    query = this.baseListJoin(query);

    const disputeCounts = await query
      .whereIn(searchField, ids)
      .select([db.raw("count(*) as count"), `${searchField} as keyId`])
      .groupBy(searchField);

    return entities.map((entity) => {
      const foundCount = disputeCounts.filter(
        (disputeCount) => disputeCount["keyId"] === entity[key]
      );
      entity[resField] = foundCount?.count ?? 0;
      return entity;
    });
  };

  bindOwnersCounts = (entities, key = "ownerId", resField = "disputes") =>
    this.bindEntitiesCounts(entities, key, `owners.id`, resField);

  bindTenantsCounts = (entities, key = "tenantId", resField = "disputes") =>
    this.bindEntitiesCounts(entities, key, `tenants.id`, resField);

  bindListingsCounts = (entities, key = "listingId", resField = "disputes") =>
    this.bindEntitiesCounts(entities, key, `${LISTINGS_TABLE}.id`, resField);

  getTypesCount = async ({ filter, timeInfos }) => {
    let query = db(DISPUTES_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${DISPUTES_TABLE}.id`)
    );

    query = this.baseListTimeFilter(timeInfos, query);

    const result = await query
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE WHEN ${DISPUTES_TABLE}.status = '${STATIC.DISPUTE_STATUSES.OPEN}' THEN 1 ELSE 0 END) AS "openCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${DISPUTES_TABLE}.status = '${STATIC.DISPUTE_STATUSES.SOLVED}' THEN 1 ELSE 0 END) AS "solvedCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${DISPUTES_TABLE}.status = '${STATIC.DISPUTE_STATUSES.UNSOLVED}' THEN 1 ELSE 0 END) AS "unsolvedCount"`
        )
      )
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      openCount: result["openCount"] ?? 0,
      solvedCount: result["solvedCount"] ?? 0,
      unsolvedCount: result["unsolvedCount"] ?? 0,
    };
  };
}

module.exports = new DisputeModel();