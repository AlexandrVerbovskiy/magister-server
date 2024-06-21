const { body } = require("express-validator");

module.exports = [
  body("clientTime")
    .isNumeric()
    .withMessage("Body field 'Client Time' must be a number"),
  body("timeFilterType")
    .optional()
    .isIn(["last-month", "last-year", "last-week", "last-day"])
    .withMessage(
      "Time filter type can be a 'last-month', 'last-year', 'last-week' or 'last-day'."
    ),
];
