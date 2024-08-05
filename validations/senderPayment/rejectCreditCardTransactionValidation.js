const { validateIntegerBody, validateBigStringBody } = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "orderId", fieldName: "OrderId" }),
  ...validateBigStringBody({
    field: "description",
    fieldName: "Description",
  }),
];
