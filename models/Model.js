const { formatDateToSQLFormat } = require("../utils");
const db = require("../database");

class Model {
  strFilterFields = [];

  orderFields = [];

  getOrderInfo = (
    props,
    defaultOrderField = this.orderFields[0] ?? "id",
    defaultOrderType = "desc"
  ) => {
    let { order, orderType } = props;

    if (!order) order = defaultOrderField;
    if (!orderType) orderType = defaultOrderType;

    orderType = orderType.toLowerCase() === "asc" ? "asc" : "desc";
    order = this.orderFields.includes(order.toLowerCase())
      ? order
      : defaultOrderField;

    return { orderType, order };
  };

  fieldLowerEqualArray = (field, values) => [
    `LOWER(${field}) IN (${values.map(() => "?").join(", ")})`,
    values.map((category) => category.toLowerCase()),
  ];

  baseStrFilter = (filter, searchableFields = null) => {
    filter = `%${filter}%`;

    if (!searchableFields) {
      searchableFields = this.strFilterFields;
    }

    const conditions = searchableFields
      .map((field) => `LOWER(${field}) ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter.toLowerCase());
    return [`(${conditions})`, props];
  };

  baseListTimeFilter = (timeInfos, query, field = "created_at") => {
    const { serverFromTime, serverToTime } = timeInfos;

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

  baseStringStartFilterDateWrap = (fieldName) =>
    db.raw(`CONCAT(DATE(${fieldName}), ' 00:00:00')`);

  baseStringEndFilterDateWrap = (fieldName) =>
    db.raw(`CONCAT(DATE(${fieldName}), ' 23:59:59')`);

  filterIdLikeString = (value, field = "id") => {
   return db.raw(`${field}::text LIKE ?`, `%${value}%`);
  };
}

module.exports = Model;
