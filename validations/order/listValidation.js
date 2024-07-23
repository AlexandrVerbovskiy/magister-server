const {
  listPaginationFilterValidation,
  listPaginationTimeStringFilterValidation,
  listTimeStringValidation,
} = require("../base");

module.exports = [
  ...listPaginationTimeStringFilterValidation,
  ...listPaginationFilterValidation,
  ...listTimeStringValidation,
];
