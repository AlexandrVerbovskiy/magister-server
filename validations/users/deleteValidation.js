const { body } = require("express-validator");

module.exports = [
  body("id").notEmpty().isInt().withMessage("User wasn't found"),
];
