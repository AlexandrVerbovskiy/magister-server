const { validateSmallStringQuery } = require("../base");

module.exports = [
  ...validateSmallStringQuery({ field: "search", fieldName: "Search" }),
];
