const { validateIntegerBody, validateSmallStringBody } = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "orderId", fieldName: "Order Id" }),
  ...validateSmallStringBody({ field: "type", fieldName: "Type" }),
];
