const { body } = require("express-validator");

module.exports = [
  body("orderId").isInt().withMessage("Body field 'Order Id' is required"),
];
