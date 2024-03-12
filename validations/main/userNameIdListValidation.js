const { query } = require("express-validator");

module.exports = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Field 'Page' must be an integer greater than or equal to 1"),
  query("perPage")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "Field 'Per page' must be an integer greater than or equal to 1"
    ),
  query("filter")
    .optional()
    .isString()
    .withMessage("Field 'Filter' must be a string"),
];
