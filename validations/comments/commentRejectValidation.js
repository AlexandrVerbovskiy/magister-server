const { body } = require("express-validator");
const { validateIdBody } = require("../base");

module.exports = [
  ...validateIdBody(),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
];
