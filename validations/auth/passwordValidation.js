const { body } = require("express-validator");

module.exports = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
];
