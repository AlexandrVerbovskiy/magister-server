const { body } = require("express-validator");
const { validateIntegerBody } = require("../base");

module.exports = [
  ...validateIntegerBody({
    field: "disputeId",
    fieldName: "Dispute Id",
  }),
  body("solution")
    .isString()
    .withMessage("Solution must be a string")
    .notEmpty()
    .withMessage("Solution cannot be empty"),
];
