const { body } = require("express-validator");

module.exports = [
  body("orderId").isInt().withMessage("Body field 'Listing Id' is required"),
  body("newPricePerDay")
    .isNumeric()
    .withMessage("Body field 'New Price Per Day' must be a number"),
  body("newPricePerDay").custom((value) => {
    if (value <= 0) {
      throw new Error(
        "Body field 'New Price Per Day' must be higher than zero"
      );
    }
    return true;
  }),
  body("newStartDate")
    .isISO8601()
    .withMessage("Body field 'New Start Date' must be a valid date in ISO 8601 format"),
  body("newEndDate")
    .isISO8601()
    .withMessage("Body field 'New End Date' must be a valid date in ISO 8601 format"),
  body("newStartDate").custom((startDate, { req }) => {
    if (new Date(startDate) < new Date()) {
      throw new Error("Body field 'New Start Date' must be greater or equal than the current date");
    }
    return true;
  }),
  body("newEndDate").custom((endDate, { req }) => {
    if (new Date(endDate) < new Date()) {
      throw new Error("Body field 'New End Date' must be greater or equal than the current date");
    }
    if (new Date(endDate) < new Date(req.body.startDate)) {
      throw new Error("Body field 'New End Date' must be greater or equal than body field 'New Start Date'");
    }
    return true;
  }),
];
