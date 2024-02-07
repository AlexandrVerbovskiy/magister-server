const { body } = require("express-validator");

module.exports = [
  body("token").isLength({ min: 1 }).withMessage("Token is a required field"),
];
