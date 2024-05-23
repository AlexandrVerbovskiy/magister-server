const { body } = require("express-validator");
const createValidation = require("./createValidation");

module.exports = [
  body("parentOrderId").isInt().withMessage("Body field 'Order Id' is required"),
  ...createValidation,
];
