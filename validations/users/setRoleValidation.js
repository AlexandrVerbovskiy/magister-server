const { body } = require("express-validator");

module.exports = [
  body("id").notEmpty().isInt().withMessage("User wasn't found"),
  body("role")
    .isIn(["admin", "user", "support"])
    .withMessage("Invalid role value"),
];
