const userModel = require("./userModel");
const db = require("../database");
const STATIC = require("../static");
const { formatDateToSQLFormat } = require("../utils");
const Model = require("./Model");
const USER_VERIFY_REQUESTS_TABLE = STATIC.TABLES.USER_VERIFY_REQUESTS;
const USER_DOCUMENTS_TABLE = STATIC.TABLES.USER_DOCUMENTS;
const USERS_TABLE = STATIC.TABLES.USERS;

class UserVerifyRequestModel extends Model {
  visibleFields = [
    `${USER_VERIFY_REQUESTS_TABLE}.id`,
    `${USER_VERIFY_REQUESTS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.name as userName`,
    `${USERS_TABLE}.email as userEmail`,
    `${USERS_TABLE}.id as userId`,
  ];

  strFilterFields = [`${USERS_TABLE}.name`, `${USERS_TABLE}.email`];

  orderFields = [
    `${USER_VERIFY_REQUESTS_TABLE}.id`,
    `${USERS_TABLE}.name`,
    `${USERS_TABLE}.email`,
    `${USERS_TABLE}.id`,
    `${USER_VERIFY_REQUESTS_TABLE}.created_at`,
  ];

  create = async (userId) => {
    await db(USER_VERIFY_REQUESTS_TABLE).insert({
      user_id: userId,
      failed_description: "",
    });
  };

  getById = async (id) => {
    return await db(USER_VERIFY_REQUESTS_TABLE)
      .where(`${USER_VERIFY_REQUESTS_TABLE}.id`, id)
      .select([
        `${USER_VERIFY_REQUESTS_TABLE}.id`,
        `${USER_VERIFY_REQUESTS_TABLE}.has_response as hasResponse`,
        `${USER_VERIFY_REQUESTS_TABLE}.failed_description as failedDescription`,
        `${USERS_TABLE}.name as userName`,
        `${USERS_TABLE}.email as userEmail`,
        ...userModel.documentFields,
        `${USER_VERIFY_REQUESTS_TABLE}.user_id as userId`,
      ])
      .leftJoin(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        `${USER_VERIFY_REQUESTS_TABLE}.user_id`
      )
      .leftJoin(
        USER_DOCUMENTS_TABLE,
        `${USER_DOCUMENTS_TABLE}.user_id`,
        `${USER_VERIFY_REQUESTS_TABLE}.user_id`
      )
      .first();
  };

  totalCount = async (filter, serverFromTime, serverToTime) => {
    let query = db(USER_VERIFY_REQUESTS_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${USER_VERIFY_REQUESTS_TABLE}.user_id`
      )
      .where("has_response", false)
      .whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter(
      { serverFromTime, serverToTime },
      query,
      `${USER_VERIFY_REQUESTS_TABLE}.created_at`
    );
    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(USER_VERIFY_REQUESTS_TABLE)
      .join(
        USERS_TABLE,
        `${USERS_TABLE}.id`,
        "=",
        `${USER_VERIFY_REQUESTS_TABLE}.user_id`
      )
      .where("has_response", false)
      .whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      props,
      query,
      `${USER_VERIFY_REQUESTS_TABLE}.created_at`
    );

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  updateUserVerifyById = async (id, description) => {
    await db(USER_VERIFY_REQUESTS_TABLE).where({ user_id: id }).update({
      has_response: true,
      failed_description: description,
    });
  };

  setViewedFailedDescription = async (id) => {
    await db(USER_VERIFY_REQUESTS_TABLE)
      .where({ id })
      .update({ viewed_failed_description: false });
  };

  checkUserHasUnansweredRequest = async (userId) => {
    const { count } = await db(USER_VERIFY_REQUESTS_TABLE)
      .where({ user_id: userId, has_response: false })
      .count("* as count")
      .first();

    return Number(count);
  };

  getLastUserAnsweredRequest = async (userId) => {
    return await db(USER_VERIFY_REQUESTS_TABLE)
      .select("failed_description as failedDescription")
      .where({ user_id: userId, has_response: true })
      .first();
  };

  getUserIdById = async (id) => {
    const res = await db(USER_VERIFY_REQUESTS_TABLE).where({ id: id }).first();
    return res?.user_id;
  };
}

module.exports = new UserVerifyRequestModel();
