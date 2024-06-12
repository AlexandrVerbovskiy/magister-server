const { body } = require("express-validator");
const { listTimeStringValidation } = require("../base");

module.exports = [
  ...listTimeStringValidation,
  body("type")
    .optional()
    .isString()
    .withMessage("Field 'Type' must be a string"),
];
