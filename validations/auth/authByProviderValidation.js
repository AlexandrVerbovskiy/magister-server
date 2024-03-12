const { validateSmallStringBody, emailValidation } = require("../base");

module.exports = [
  ...emailValidation,
  ...validateSmallStringBody({
    field: "token",
    fieldName: "Token",
  }),
  ...validateSmallStringBody({ field: "name", fieldName: "Name" }),
  ...validateSmallStringBody({ field: "provider", fieldName: "Provider" }),
];
