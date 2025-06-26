const { body } = require("express-validator");
const {
  validateBigStringBody,
  validateIntegerBody,
  validateFloat,
  validateDateTime,
} = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "listingId", fieldName: "Listing Id" }),
  ...validateFloat({ field: "price", fieldName: "Price" }),
  ...validateDateTime({ field: "startTime", fieldName: "Start Time" }),
  ...validateDateTime({ field: "finishTime", fieldName: "Finish Time" }),
  ...validateBigStringBody({
    field: "message",
    fieldName: "Message",
  }),
];
