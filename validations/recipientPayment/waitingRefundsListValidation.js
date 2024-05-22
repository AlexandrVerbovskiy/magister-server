const {
  listPaginationFilterValidation,
  listPaginationTimeStringFilterValidation,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...listPaginationTimeStringFilterValidation,
  ...listPaginationFilterValidation,
];
