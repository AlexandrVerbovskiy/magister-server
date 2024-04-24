const { body } = require("express-validator");
const {
  listPaginationStringFilterValidation,
  listPaginationFilterValidation,
} = require("../base");

module.exports = [
  ...listPaginationStringFilterValidation,
  ...listPaginationFilterValidation,
];
