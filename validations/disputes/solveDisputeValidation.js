const { body } = require("express-validator");
const { validateIntegerBody } = require("../base");

module.exports = [
  ...validateIntegerBody({
    field: "disputeId",
    fieldName: "Dispute Id",
  }),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
];
