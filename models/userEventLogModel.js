require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const BaseModel = require("./baseModel");

const USER_EVENT_LOGS_TABLE = STATIC.TABLES.USER_EVENT_LOGS;

class UserEventLogModel extends BaseModel {
  visibleFields = [
    "id",
    "user_id as userId",
    "user_email as userEmail",
    "user_role as userRole",
    "event_name as eventName",
    "created_at as createdAt",
  ];

  create = async ({ user_id, user_email, user_role, event_name }) => {
    await db(USER_EVENT_LOGS_TABLE).insert({
      user_id,
      user_email,
      user_role,
      event_name,
    });
  };

  logFilter = (filter) => {
    filter = `%${filter}%`;
    const searchableFields = ["user_email", "user_role", "event_name"];

    const conditions = searchableFields
      .map((field) => `${field} ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return [`(${conditions})`, props];
  };

  totalCount = async (filter, serverFromTime, serverToTime) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(...this.logFilter(filter));
    query = this.baseListTimeFilter({ serverFromTime, serverToTime }, query);
    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;

    const canBeOrderFields = [
      "id",
      "user_id",
      "user_email",
      "user_role",
      "event_name",
      "created_at",
    ];

    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(...this.logFilter(filter));
    query = this.baseListTimeFilter(props, query);
    const { order, orderType } = this.baseListOrder(props, canBeOrderFields);

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };
}

module.exports = new UserEventLogModel();
