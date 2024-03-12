const { body } = require("express-validator");
const {
  listPaginationStringFilterValidation,
  listPaginationFilterValidation,
} = require("../base");

module.exports = [
  ...listPaginationStringFilterValidation,
  ...listPaginationFilterValidation,
  body("cities")
    .optional()
    .isArray()
    .withMessage("Field 'Cities' must be an array"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Field 'Categories' must be an array"),
];
