const { validateIntegerBody, validateFloat } = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "orderId", fieldName: "OrderId" }),
  ...validateFloat({ field: "amount", fieldName: "Amount" }),
];
