const { body } = require("express-validator");
const idValidation = require("./idValidation");

module.exports = [
  idValidation,
  body("role")
    .isIn(["admin", "user", "support"])
    .withMessage("Invalid role value"),
];
