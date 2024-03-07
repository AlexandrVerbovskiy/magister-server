const { formatDateToSQLFormat } = require("../utils");
const db = require("../database");

class Model {
  strFilterFields = [];

  orderFields = [];

  getOrderInfo = (
    props,
    defaultOrderField = this.orderFields[0] ?? "id",
    defaultOrderType = "asc"
  ) => {
    let { order, orderType } = props;

    if (!order) order = defaultOrderField;
    if (!orderType) orderType = defaultOrderType;

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = this.orderFields.includes(order.toLowerCase())
      ? order
      : defaultOrderField;

    return { orderType, order };
  };

  baseStrFilter = (filter) => {
    filter = `%${filter}%`;
    const searchableFields = this.strFilterFields;

    const conditions = searchableFields
      .map((field) => `${field} ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return [`(${conditions})`, props];
  };

  baseListTimeFilter = (props, query, field = "created_at") => {
    const { serverFromTime, serverToTime } = props;

    if (serverFromTime) {
      query = query.where(field, ">=", formatDateToSQLFormat(serverFromTime));
    }

    if (serverToTime) {
      query = query.where(field, "<=", formatDateToSQLFormat(serverToTime));
    }

    return query;
  };

  baseGetById = async (id, model) => {
    return await db(model).where("id", id).select(this.visibleFields).first();
  };
}

module.exports = Model;
