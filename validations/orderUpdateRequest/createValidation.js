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
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage(
      "Body field 'New Start Date' must be a valid date in YYYY-MM-DD format"
    )
    .custom((startDate, { req }) => {
      const todayDate = new Date().toISOString().split("T")[0];

      if (startDate < todayDate) {
        throw new Error(
          "Body field 'New Start Date' must be greater or equal than the current date"
        );
      }
      return true;
    }),
  body("newEndDate")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage(
      "Body field 'New End Date' must be a valid date in YYYY-MM-DD format"
    )
    .custom((endDate, { req }) => {
      const todayDate = new Date().toISOString().split("T")[0];

      if (endDate < todayDate) {
        throw new Error(
          "Body field 'New End Date' must be greater or equal than the current date"
        );
      }
      if (endDate < req.body.newStartDate) {
        throw new Error(
          "Body field 'New End Date' must be greater or equal than body field 'New Start Date'"
        );
      }
      return true;
    }),
];
