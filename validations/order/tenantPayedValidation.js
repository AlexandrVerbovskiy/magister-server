const { validateSmallStringBody, validateIdBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
  ...validateIdBody(),
];
