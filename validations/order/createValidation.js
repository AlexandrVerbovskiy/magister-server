const { body } = require("express-validator");
const {
  validateBoolean,
  validateBigStringBody,
  validateIntegerBody,
} = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "listingId", fieldName: "Listing Id" }),
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
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage(
      "Body field 'Start Date' must be a valid date in YYYY-MM-DD format"
    )
    .custom((startDate, { req }) => {
      const todayDate = new Date().toISOString().split("T")[0];

      if (startDate < todayDate) {
        throw new Error(
          "Body field 'Start Date' must be greater or equal than the current date"
        );
      }
      return true;
    }),
  body("endDate")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage(
      "Body field 'End Date' must be a valid date in YYYY-MM-DD format"
    )
    .custom((endDate, { req }) => {
      const todayDate = new Date().toISOString().split("T")[0];

      if (endDate < todayDate) {
        throw new Error(
          "Body field 'End Date' must be greater or equal than the current date"
        );
      }
      if (endDate < req.body.startDate) {
        throw new Error(
          "Body field 'End Date' must be greater or equal than Body field 'Start Date'"
        );
      }
      return true;
    }),
  ...validateBoolean({ field: "feeActive", fieldName: "Fee Active" }),
  ...validateBigStringBody({
    field: "message",
    fieldName: "Message",
  }),
];
