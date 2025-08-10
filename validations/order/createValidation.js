const { body } = require("express-validator");
const {
  validateBigStringBody,
  validateIntegerBody,
  validateFloat,
  validateDateTime,
} = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "listingId", fieldName: "Listing Id" }),
  ...validateIntegerBody({ field: "disputeProbability", fieldName: "Dispute Probability" }),
  ...validateFloat({ field: "price", fieldName: "Price" }),
  ...validateDateTime({ field: "startDate", fieldName: "Start Time" }),
  ...validateDateTime({ field: "finishDate", fieldName: "Finish Time" }),
  ...validateBigStringBody({
    field: "message",
    fieldName: "Message",
  }),
];
