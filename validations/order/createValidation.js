const { body } = require("express-validator");

module.exports = [
  body("listingId").isInt().withMessage("Body field 'Listing Id' is required"),
  body("pricePerDay")
    .isNumeric()
    .withMessage("Body field 'Price Per Day' must be a number"),
  body("pricePerDay").custom((value) => {
    if (value <= 0) {
      throw new Error("Body field 'Price Per Day' must be higher than zero");
    }
    return true;
  }),
  body("startDate")
    .isISO8601()
    .withMessage("Body field 'Start Date' must be a valid date in ISO 8601 format"),
  body("endDate")
    .isISO8601()
    .withMessage("Body field 'End Date' must be a valid date in ISO 8601 format"),
  body("startDate").custom((startDate, { req }) => {
    if (new Date(startDate) < new Date()) {
      throw new Error("Body field 'Start Date' must be greater or equal than the current date");
    }
    return true;
  }),
  body("endDate").custom((endDate, { req }) => {
    if (new Date(endDate) < new Date()) {
      throw new Error("Body field 'End Date' must be greater or equal than the current date");
    }
    if (new Date(endDate) < new Date(req.body.startDate)) {
      throw new Error("Body field 'End Date' must be greater or equal than Body field 'Start Date'");
    }
    return true;
  }),
];
