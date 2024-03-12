const { validateSmallStringBody, emailValidation } = require("../base");

module.exports = [
  ...emailValidation,
  ...validateSmallStringBody({
    field: "token",
    fieldName: "Token",
  }),
];
