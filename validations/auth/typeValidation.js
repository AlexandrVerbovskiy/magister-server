const { body } = require("express-validator");

module.exports = [
  body("type").isLength({ min: 1 }).withMessage("Type is a required field"),
];
