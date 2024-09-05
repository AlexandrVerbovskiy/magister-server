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
    `${USERS_TABLE}.phone as userPhone`,
    `${USERS_TABLE}.photo as userPhoto`,
    `${USERS_TABLE}.facebook_url as userFacebookUrl`,
    `${USERS_TABLE}.linkedin_url as userLinkedinUrl`,
    `${USERS_TABLE}.instagram_url as userInstagramUrl`,
    `${USERS_TABLE}.email_verified as userEmailVerified`,
    `${USERS_TABLE}.phone_verified as userPhoneVerified`,
    `${USERS_TABLE}.id as userId`,
    `${USER_VERIFY_REQUESTS_TABLE}.has_response as hasResponse`,
    `${USER_VERIFY_REQUESTS_TABLE}.failed_description as failedDescription`,
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

  baseListJoin = (query) =>
    query.join(
      USERS_TABLE,
      `${USERS_TABLE}.id`,
      "=",
      `${USER_VERIFY_REQUESTS_TABLE}.user_id`
    );

  queryByStatus = (query, status) => {
    if (status == "approved") {
      query = query
        .where(`${USER_VERIFY_REQUESTS_TABLE}.has_response`, true)
        .where(`${USER_VERIFY_REQUESTS_TABLE}.failed_description`, "");
    }

    if (status == "rejected") {
      query = query
        .where(`${USER_VERIFY_REQUESTS_TABLE}.has_response`, true)
        .whereNot(`${USER_VERIFY_REQUESTS_TABLE}.failed_description`, "");
    }

    if (status == "suspended") {
      query.where((builder) => {
        builder
          .where(`${USER_VERIFY_REQUESTS_TABLE}.has_response`, false)
          .orWhereNull(`${USER_VERIFY_REQUESTS_TABLE}.has_response`);
      });
    }

    return query;
  };

  totalCount = async (filter, timeInfos, status = null) => {
    let query = db(USER_VERIFY_REQUESTS_TABLE);
    query = this.baseListJoin(query);
    query = query.whereRaw(
      this.filterIdLikeString(filter, `${USER_VERIFY_REQUESTS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${USER_VERIFY_REQUESTS_TABLE}.created_at`
    );

    query = this.queryByStatus(query, status);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const { filter, start, count, status = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(USER_VERIFY_REQUESTS_TABLE);
    query = this.baseListJoin(query);
    query = query.whereRaw(
      this.filterIdLikeString(filter, `${USER_VERIFY_REQUESTS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${USER_VERIFY_REQUESTS_TABLE}.created_at`
    );

    query = this.queryByStatus(query, status);

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  updateUserVerifyById = async (id, description) => {
    await db(USER_VERIFY_REQUESTS_TABLE).where({ id }).update({
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
    const result = await db(USER_VERIFY_REQUESTS_TABLE)
      .where({ user_id: userId, has_response: false })
      .count("* as count")
      .first();

    return +result?.count;
  };

  getLastUserAnsweredRequest = async (userId) => {
    return await db(USER_VERIFY_REQUESTS_TABLE)
      .select("failed_description as failedDescription")
      .where({ user_id: userId, has_response: true })
      .orderBy("created_at", "DESC")
      .first();
  };

  getLastUserNotAnsweredRequest = async (userId) => {
    return await db(USER_VERIFY_REQUESTS_TABLE)
      .select([
        `${USER_VERIFY_REQUESTS_TABLE}.id`,
        `${USER_VERIFY_REQUESTS_TABLE}.created_at as createdAt`,
        `${USER_VERIFY_REQUESTS_TABLE}.has_response as hasResponse`,
        `${USER_VERIFY_REQUESTS_TABLE}.failed_description as failedDescription`,
      ])
      .where({ user_id: userId, has_response: false })
      .orderBy("created_at", "DESC")
      .first();
  };

  getUserIdById = async (id) => {
    const res = await db(USER_VERIFY_REQUESTS_TABLE).where({ id: id }).first();
    return res?.user_id;
  };
}

module.exports = new UserVerifyRequestModel();
