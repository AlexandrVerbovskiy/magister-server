const { body } = require("express-validator");
const requiredId = require("./requiredId");

module.exports = [
  requiredId,
  body("role")
    .isIn(["admin", "user", "support"])
    .withMessage("Invalid role value"),
];
