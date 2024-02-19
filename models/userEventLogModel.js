require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const { formatDateToSQLFormat } = require("../utils");

const USER_EVENT_LOGS_TABLE = STATIC.TABLES.USER_EVENT_LOGS;

class UserEventLogModel {
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

  totalCount = async (filter, fromTime, toTime) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(...this.logFilter(filter));

    if (fromTime) {
      query = query.where("created_at", ">=", formatDateToSQLFormat(fromTime));
    }

    if (toTime) {
      query = query.where("created_at", "<=", formatDateToSQLFormat(toTime));
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async ({
    filter,
    order,
    orderType,
    start,
    count,
    fromTime,
    toTime,
  }) => {
    const canBeOrderField = [
      "id",
      "user_id",
      "user_email",
      "user_role",
      "event_name",
      "created_at",
    ];

    if (!order) order = "id";
    if (!orderType) orderType = "asc";

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = canBeOrderField.includes(order.toLowerCase()) ? order : "id";

    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(...this.logFilter(filter));

    if (fromTime) {
      query = query.where("created_at", ">=", formatDateToSQLFormat(fromTime));
    }

    if (toTime) {
      query = query.where("created_at", "<=", formatDateToSQLFormat(toTime));
    }

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };
}

module.exports = new UserEventLogModel();
