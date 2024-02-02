const { body } = require("express-validator");

module.exports = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is a required field")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
];
