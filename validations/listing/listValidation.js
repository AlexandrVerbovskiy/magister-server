const { body } = require("express-validator");
const {
  listPaginationStringFilterValidation,
  listPaginationFilterValidation,
} = require("../base");

module.exports = [
  ...listPaginationStringFilterValidation,
  ...listPaginationFilterValidation,
  body("cities")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Field 'Cities' must be an array"),
  body("categories")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Field 'Categories' must be an array"),
];
