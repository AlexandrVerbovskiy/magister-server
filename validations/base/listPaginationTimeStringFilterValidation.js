const listTimeFilterValidation = require("./listTimeFilterValidation");
const listPaginationStringFilterValidation = require("./listPaginationStringFilterValidation");

module.exports = [
  ...listPaginationStringFilterValidation,
  ...listTimeFilterValidation,
];
