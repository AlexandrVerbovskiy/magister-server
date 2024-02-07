const { body } = require("express-validator");

module.exports = [
  body("id").notEmpty().isInt().withMessage("Log wasn't found"),
];
