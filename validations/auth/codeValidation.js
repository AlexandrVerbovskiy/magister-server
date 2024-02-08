const { body } = require("express-validator");

module.exports = [
  body("code").isLength({ min: 1 }).withMessage("Code is a required field"),
];
