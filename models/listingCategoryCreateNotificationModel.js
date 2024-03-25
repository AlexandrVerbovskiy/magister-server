require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE =
  STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS;

const USERS_TABLE = STATIC.TABLES.USERS;

class ListingCategoryCreateNotificationModel extends Model {
  create = async (userId, categoryName) => {
    const res = await db(LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE)
      .insert({
        user_id: userId,
        category_name: categoryName,
      })
      .returning("id");

    return res[0]["id"];
  };

  deleteList = async (ids) => {
    await db(LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE)
      .whereIn("id", ids)
      .delete();
  };

  getForCategoryName = async (name) => {
    const res = await db(LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE)
      .where("category_name", name)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE}.user_id`
      )
      .select([
        `${LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE}.id`,
        `${USERS_TABLE}.email as userEmail`,
      ]);

    return res;
  };

  checkUserHasCategoryNotify = async (userId, categoryName) => {
    const res = await db(LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE)
      .where("user_id", userId)
      .where("category_name", categoryName)
      .select([`${LISTING_CATEGORY_CREATE_NOTIFICATIONS_TABLE}.id`]);

    return res[0]?.id;
  };
}

module.exports = new ListingCategoryCreateNotificationModel();
