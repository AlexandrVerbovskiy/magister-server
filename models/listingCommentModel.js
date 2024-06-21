require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const BaseCommentModel = require("./BaseCommentModel");

const LISTING_COMMENTS_TABLE = STATIC.TABLES.LISTING_COMMENTS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class ListingCommentModel extends BaseCommentModel {
  table = LISTING_COMMENTS_TABLE;

  keyField = `${ORDERS_TABLE}.listing_id`;
  keyFieldName = `listingId`;
  reviewerIdField = `${ORDERS_TABLE}.tenant_id`;

  pointFields = [
    `punctuality`,
    `generalExperience`,
    `communication`,
    `reliability`,
    `kindness`,
    `flexibility`,
  ];

  visibleFields = [
    `${LISTING_COMMENTS_TABLE}.id`,
    `${LISTING_COMMENTS_TABLE}.description`,
    `${LISTING_COMMENTS_TABLE}.punctuality`,
    `${LISTING_COMMENTS_TABLE}.general_experience as generalExperience`,
    `${LISTING_COMMENTS_TABLE}.communication`,
    `${LISTING_COMMENTS_TABLE}.reliability`,
    `${LISTING_COMMENTS_TABLE}.kindness`,
    `${LISTING_COMMENTS_TABLE}.flexibility`,
    `${LISTING_COMMENTS_TABLE}.approved`,
    `${LISTING_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${LISTING_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${LISTING_COMMENTS_TABLE}.created_at as createdAt`,
    `${LISTING_COMMENTS_TABLE}.order_id as orderId`,
    `reviewers.id as reviewerId`,
    `reviewers.name as reviewerName`,
    `reviewers.email as reviewerEmail`,
    `reviewers.phone as reviewerPhone`,
    `reviewers.photo as reviewerPhoto`,
    `${LISTINGS_TABLE}.id as listingId`,
    `${LISTINGS_TABLE}.name as listingName`,
    `${LISTINGS_TABLE}.city as listingCity`,
    `${LISTINGS_TABLE}.price_per_day as listingPricePerDay`,
    `${LISTINGS_TABLE}.min_rental_days as listingMinRentalDays`,
    `${LISTINGS_TABLE}.count_stored_items as listingCountStoredItems`,
    `${LISTINGS_TABLE}.category_id as listingCategoryId`,
    `${LISTING_CATEGORIES_TABLE}.name as listingCategoryName`,
  ];

  strFilterFields = [`${LISTINGS_TABLE}.name`, `reviewers.name`];

  orderFields = [
    `${LISTING_COMMENTS_TABLE}.id`,
    `${LISTING_COMMENTS_TABLE}.created_at`,
    `${LISTINGS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseJoin = (query) => {
    return query
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${LISTING_COMMENTS_TABLE}.order_id`
      )
      .join(
        `${USERS_TABLE} as reviewers`,
        `reviewers.id`,
        "=",
        `${ORDERS_TABLE}.tenant_id`
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
      );
  };

  baseSelect = () => {
    let query = db(LISTING_COMMENTS_TABLE);
    query = this.baseJoin(query);
    return query;
  };

  create = async ({
    description,
    punctuality,
    communication,
    flexibility,
    reliability,
    kindness,
    generalExperience,
    orderId,
  }) => {
    const res = await db(LISTING_COMMENTS_TABLE)
      .insert({
        description,

        punctuality,
        communication,
        flexibility,
        reliability,
        kindness,
        general_experience: generalExperience,

        order_id: orderId,
        rejected_description: "",
      })
      .returning("id");

    return res[0]["id"];
  };

  getBaseListingStatisticQuery = () => {
    return db(LISTING_COMMENTS_TABLE)
      .select([
        `${LISTINGS_TABLE}.id`,
        db.raw(`COUNT(${LISTING_COMMENTS_TABLE}.id) AS "commentCount"`),

        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.punctuality) AS "averagePunctuality"`
        ),
        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.general_experience) AS "averageGeneralExperience"`
        ),
        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.communication) AS "averageCommunication"`
        ),
        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.reliability) AS "averageReliability"`
        ),
        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.kindness) AS "averageKindness"`
        ),
        db.raw(
          `AVG(${LISTING_COMMENTS_TABLE}.flexibility) AS "averageFlexibility"`
        ),

        db.raw(`(
            AVG(${LISTING_COMMENTS_TABLE}.punctuality) + AVG(${LISTING_COMMENTS_TABLE}.general_experience)
            + AVG(${LISTING_COMMENTS_TABLE}.communication) + AVG(${LISTING_COMMENTS_TABLE}.reliability)
            + AVG(${LISTING_COMMENTS_TABLE}.kindness) + AVG(${LISTING_COMMENTS_TABLE}.flexibility)
           ) / 6 AS "averageRating"`),
      ])
      .where(`${LISTINGS_TABLE}.approved`, true)
      .where(`${USERS_TABLE}.verified`, true)
      .where(`${USERS_TABLE}.active`, true)
      .where(`${LISTINGS_TABLE}.active`, true)
      .where(`${LISTING_COMMENTS_TABLE}.approved`, true)
      .where(`${LISTING_COMMENTS_TABLE}.waiting_admin`, false)
      .join(
        ORDERS_TABLE,
        `${ORDERS_TABLE}.id`,
        "=",
        `${LISTING_COMMENTS_TABLE}.order_id`
      )
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${ORDERS_TABLE}.listing_id`
      )
      .join(USERS_TABLE, `${USERS_TABLE}.id`, "=", `${LISTINGS_TABLE}.owner_id`)
      .groupBy([`${LISTINGS_TABLE}.id`]);
  };

  getListingDetailInfo = async (id) => {
    let listingDetails = await this.getBaseListingStatisticQuery()
      .where(`${LISTINGS_TABLE}.id`, id)
      .first();

    if (!listingDetails) {
      listingDetails = {
        id,
        commentCount: 0,
        averagePunctuality: 0,
        averageGeneralExperience: 0,
        averageCommunication: 0,
        averageReliability: 0,
        averageKindness: 0,
        averageFlexibility: 0,
        averageRating: 0,
      };
    }

    Object.keys(listingDetails).forEach(
      (key) => (listingDetails[key] = Number(listingDetails[key]))
    );

    return listingDetails;
  };

  topListingsByRating = async (count) =>
    await this.getBaseListingStatisticQuery()
      .orderBy([`commentCount`, `averageRating`])
      .limit(count);
}

module.exports = new ListingCommentModel();
