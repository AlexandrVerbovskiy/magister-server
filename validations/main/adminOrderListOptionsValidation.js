const {
  listPaginationTimeStringFilterValidation,
  listPaginationFilterValidation,
} = require("../base");

module.exports = [
  ...listPaginationTimeStringFilterValidation,
  ...listPaginationFilterValidation,
];
