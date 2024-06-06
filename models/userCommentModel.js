require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const baseCommentModel = require("./baseCommentModel");

const USER_COMMENTS_TABLE = STATIC.TABLES.USER_COMMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;

class UserCommentModel extends baseCommentModel {
  table = USER_COMMENTS_TABLE;

  keyField = `user_id`;
  keyFieldName = `userId`;

  pointFields = [
    `quality`,
    `listingAccuracy`,
    `utility`,
    `condition`,
    `performance`,
    `location`,
  ];

  visibleFields = [
    `${USER_COMMENTS_TABLE}.id`,
    `${USER_COMMENTS_TABLE}.description`,
    `${USER_COMMENTS_TABLE}.type`,
    `${USER_COMMENTS_TABLE}.quality`,
    `${USER_COMMENTS_TABLE}.listing_accuracy as listingAccuracy`,
    `${USER_COMMENTS_TABLE}.utility`,
    `${USER_COMMENTS_TABLE}.condition`,
    `${USER_COMMENTS_TABLE}.performance`,
    `${USER_COMMENTS_TABLE}.location`,
    `${USER_COMMENTS_TABLE}.approved`,
    `${USER_COMMENTS_TABLE}.waiting_admin as waitingAdmin`,
    `${USER_COMMENTS_TABLE}.rejected_description as rejectedDescription`,
    `${USER_COMMENTS_TABLE}.created_at as createdAt`,
    `${USER_COMMENTS_TABLE}.user_id as userId`,
    `${USER_COMMENTS_TABLE}.reviewer_id as reviewerId`,
    `reviewers.name as reviewerName`,
    `reviewers.email as reviewerEmail`,
    `reviewers.phone as reviewerPhone`,
    `reviewers.photo as reviewerPhoto`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.email as userEmail`,
    `${USERS_TABLE}.phone as userPhone`,
    `${USERS_TABLE}.photo as userPhoto`,
  ];

  strFilterFields = [`${USERS_TABLE}.name`, `reviewers.name`];

  orderFields = [
    `${USER_COMMENTS_TABLE}.id`,
    `${USER_COMMENTS_TABLE}.created_at`,
    `${USERS_TABLE}.name`,
    `reviewers.name`,
  ];

  baseSelect = () => {
    const query = db(USER_COMMENTS_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${USER_COMMENTS_TABLE}.user_id`
      )
      .join(
        `${USERS_TABLE} as renters`,
        `${USERS_TABLE}.id`,
        "=",
        `${USER_COMMENTS_TABLE}.reviewer_id`
      )
      .where("type", this.type)
      .orderBy(`${USER_COMMENTS_TABLE}.created_at`, "DESC");

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
    const res = await db(USER_COMMENTS_TABLE)
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

module.exports = new UserCommentModel();
