const { body } = require("express-validator");

module.exports = [
  body("role")
    .isIn(["admin", "user", "support"])
    .withMessage("Invalid role value"),
];
