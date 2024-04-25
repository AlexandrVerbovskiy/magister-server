const { body } = require("express-validator");

module.exports = [
  body("id").exists().withMessage("Payment method ID is required"),
  body("amount")
    .exists()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
];
