const { body } = require("express-validator");

module.exports = [
  body("orderId").isInt().withMessage("Order Id must be a number").toInt(),

  body("type")
    .isString()
    .withMessage("Type must be a string")
    .notEmpty()
    .withMessage("Type cannot be empty"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
];
