const { formatDateToSQLFormat } = require("../utils");

class BaseModel {
  baseListOrder = (props, canBeOrderFields) => {
    let { order, orderType } = props;

    if (!order) {
      order = "id";
      orderType = "desc";
    }
    if (!orderType) orderType = "asc";

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = canBeOrderFields.includes(order.toLowerCase()) ? order : "id";

    return { orderType, order };
  };

  baseListTimeFilter = (props, query) => {
    const { serverFromTime, serverToTime } = props;

    if (serverFromTime) {
      query = query.where(
        "created_at",
        ">=",
        formatDateToSQLFormat(serverFromTime)
      );
    }

    if (serverToTime) {
      query = query.where(
        "created_at",
        "<=",
        formatDateToSQLFormat(serverToTime)
      );
    }

    return query;
  };
}

module.exports = BaseModel;
