const { body } = require("express-validator");
const validateDate = require("./validateDate");

module.exports = [
  body("clientHoursUtc")
    .isNumeric()
    .withMessage("Body field 'Client Hours Utc' must be a number"),
  ...validateDate({
    field: "fromTime",
    fieldName: "From Time",
    required: false,
  }),
  ...validateDate({
    field: "toTime",
    fieldName: "To Time",
    required: false,
  }),
];
