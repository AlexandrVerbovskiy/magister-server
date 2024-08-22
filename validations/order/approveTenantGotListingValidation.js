const { validateSmallStringBody, validateBigStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
];
