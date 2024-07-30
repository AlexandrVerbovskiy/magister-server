const { validateIntegerBody } = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "orderId", fieldName: "Order Id" }),
];
