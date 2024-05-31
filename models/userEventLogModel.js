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

  totalCount = async (filter, timeInfos) => {
    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );
    query = this.baseListTimeFilter(timeInfos, query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(USER_EVENT_LOGS_TABLE).whereRaw(
      this.filterIdLikeString(filter, `${USER_EVENT_LOGS_TABLE}.id`)
    );

    query = this.baseListTimeFilter(props.timeInfos, query);

    return await query
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };
}

module.exports = new UserEventLogModel();
