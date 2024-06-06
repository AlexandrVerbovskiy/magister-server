require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const baseCommentModel = require("./baseCommentModel");

const LISTING_COMMENTS_TABLE = STATIC.TABLES.LISTING_COMMENTS;
const LISTINGS_TABLE = STATIC.TABLES.LISTINGS;
const USERS_TABLE = STATIC.TABLES.USERS;
const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class ListingCommentModel extends baseCommentModel {
  table = LISTING_COMMENTS_TABLE;

  keyField = `listing_id`;
  keyFieldName = `listingId`;

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
    `${LISTING_COMMENTS_TABLE}.listing_id as listingId`,
    `${LISTING_COMMENTS_TABLE}.reviewer_id as reviewerId`,
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

  baseSelect = () => {
    const query = db(USER_COMMENTS_TABLE)
      .join(
        `${USERS_TABLE} as renters`,
        `${USERS_TABLE}.id`,
        "=",
        `${USER_COMMENTS_TABLE}.reviewer_id`
      )
      .join(
        LISTINGS_TABLE,
        `${LISTINGS_TABLE}.id`,
        "=",
        `${USER_COMMENTS_TABLE}.listing_id`
      )
      .join(
        LISTING_CATEGORIES_TABLE,
        `${LISTING_CATEGORIES_TABLE}.id`,
        "=",
        `${LISTINGS_TABLE}.category_id`
      )
      .orderBy(`${LISTING_COMMENTS_TABLE}.created_at`, "DESC");

    return query;
  };

  create = async ({
    description,
    listingId,
    reviewerId,
    punctuality,
    communication,
    flexibility,
    reliability,
    kindness,
    generalExperience,
  }) => {
    const res = await db(LISTING_COMMENTS_TABLE)
      .insert({
        description,
        listing_id: listingId,
        reviewer_id: reviewerId,
        punctuality,
        communication,
        flexibility,
        reliability,
        kindness,
        general_experience: generalExperience,
        rejected_description: "",
      })
      .returning("id");

    return res[0]["id"];
  };
}

module.exports = new ListingCommentModel();
