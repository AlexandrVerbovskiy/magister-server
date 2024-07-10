require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const USER_EVENT_LOGS_TABLE = STATIC.TABLES.USER_EVENT_LOGS;

class UserEventLogModel extends Model {
  visibleFields = [
    "id",
    "user_id as userId",
    "user_email as userEmail",
    "user_role as userRole",
    "event_name as eventName",
    "created_at as createdAt",
  ];

  strFilterFields = ["user_email", "user_role", "event_name"];

  orderFields = [
    "id",
    "user_id",
    "user_email",
    "user_role",
    "event_name",
    "created_at",
  ];

  create = async ({ user_id, user_email, user_role, event_name }) => {
    await db(USER_EVENT_LOGS_TABLE).insert({
      user_id,
      user_email,
      user_role,
      event_name,
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

  totalCount = async ({ filter, timeInfos, type = null }) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(timeInfos, query);
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

    query = this.baseListTimeFilter(props.timeInfos, query);

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

    query = this.baseListTimeFilter(timeInfos, query);

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
