const { validateSmallStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
];
