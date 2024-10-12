const { body } = require("express-validator");
const {
  validateBoolean,
  validateBigStringBody,
  validateIntegerBody,
} = require("../base");

module.exports = [
  ...validateIntegerBody({ field: "listingId", fieldName: "Listing Id" }),
  ...validateBoolean({ field: "feeActive", fieldName: "Fee Active" }),
  ...validateBigStringBody({
    field: "message",
    fieldName: "Message",
  }),
];
