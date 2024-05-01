const { validateSmallStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "orderId", fieldName: "OrderId" }),
];
