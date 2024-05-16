const { validateSmallStringParam } = require("../base");

module.exports = [
  ...validateSmallStringParam({ field: "token", fieldName: "Token" }),
];
