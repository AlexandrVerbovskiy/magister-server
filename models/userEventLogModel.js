require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const USER_EVENT_LOGS_TABLE = STATIC.TABLES.USER_EVENT_LOGS;
const USERS_TABLE = STATIC.TABLES.USERS;

class UserEventLogModel extends Model {
  visibleFields = [
    `${USER_EVENT_LOGS_TABLE}.id`,
    `${USER_EVENT_LOGS_TABLE}.user_id as userId`,
    `${USER_EVENT_LOGS_TABLE}.user_email as userEmail`,
    `${USER_EVENT_LOGS_TABLE}.user_role as userRole`,
    `${USER_EVENT_LOGS_TABLE}.event_name as eventName`,
    `${USER_EVENT_LOGS_TABLE}.created_at as createdAt`,
    `${USERS_TABLE}.photo as userPhoto`,
  ];

  strFilterFields = [
    `${USER_EVENT_LOGS_TABLE}.user_email`,
    `${USER_EVENT_LOGS_TABLE}.user_role`,
    `${USER_EVENT_LOGS_TABLE}.event_name`,
  ];

  orderFields = [
    `${USER_EVENT_LOGS_TABLE}.id`,
    `${USER_EVENT_LOGS_TABLE}.user_id`,
    `${USER_EVENT_LOGS_TABLE}.user_email`,
    `${USER_EVENT_LOGS_TABLE}.user_role`,
    `${USER_EVENT_LOGS_TABLE}.event_name`,
    `${USER_EVENT_LOGS_TABLE}.created_at`,
  ];

  create = async ({ userId, userEmail, userRole, eventName }) => {
    await db(USER_EVENT_LOGS_TABLE).insert({
      user_id: userId,
      user_email: userEmail,
      user_role: userRole,
      event_name: eventName,
    });
  };

  baseTypeWhere = (query, type) => {
    if (type == "user") {
      query = query.where("user_role", "user");
    }

    if (type == "admin") {
      query = query.where("user_role", "admin");
    }

    return query;
  };

  baseJoin = (query) => {
    return query.join(
      USERS_TABLE,
      `${USERS_TABLE}.id`,
      "=",
      `${USER_EVENT_LOGS_TABLE}.user_id`
    );
  };

  totalCount = async ({ filter, timeInfos, type = null }) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );

    query = this.baseJoin(query);
    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${USER_EVENT_LOGS_TABLE}.created_at`
    );
    query = this.baseTypeWhere(query, type);

    const result = await query.count("* as count").first();
    return +result?.count;
  };

  list = async (props) => {
    const { filter, start, count, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );

    query = this.baseJoin(query);
    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${USER_EVENT_LOGS_TABLE}.created_at`
    );
    query = this.baseTypeWhere(query, type);

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };

  getTypesCount = async ({ filter, timeInfos }) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${USER_EVENT_LOGS_TABLE}.created_at`
    );

    const result = await query
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE WHEN ${USER_EVENT_LOGS_TABLE}.user_role = 'user' THEN 1 ELSE 0 END) AS "userCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${USER_EVENT_LOGS_TABLE}.user_role = 'admin' THEN 1 ELSE 0 END) AS "adminCount"`
        )
      )
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      userCount: result["userCount"] ?? 0,
      adminCount: result["adminCount"] ?? 0,
    };
  };
}

module.exports = new UserEventLogModel();
