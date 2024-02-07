const typeValidation = require("./typeValidation");
const { body } = require("express-validator");

module.exports = [
  typeValidation,
  body("code").isLength({ min: 1 }).withMessage("Code is a required field"),
  body("id").notEmpty().isInt().withMessage("Invalid user id field"),
];
