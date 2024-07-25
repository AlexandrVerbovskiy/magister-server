const { validateIntegerBody, validateFloat } = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "orderId", fieldName: "OrderId" }),
];
