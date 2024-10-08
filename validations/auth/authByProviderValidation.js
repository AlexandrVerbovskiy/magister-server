const {
  validateSmallStringBody,
  emailValidation,
  validateBigStringBody,
} = require("../base");

module.exports = [
  ...validateBigStringBody({
    field: "token",
    fieldName: "Token",
  }),
  ...validateSmallStringBody({ field: "name", fieldName: "Name" }),
  ...validateSmallStringBody({ field: "provider", fieldName: "Provider" }),
];
