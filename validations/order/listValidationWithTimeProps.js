const {
  listPaginationFilterValidation,
  listPaginationTimeStringFilterValidation,
} = require("../base");

module.exports = [
  ...listPaginationTimeStringFilterValidation,
  ...listPaginationFilterValidation,
];
