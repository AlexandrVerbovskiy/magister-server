const { validateSmallStringBody, validatePassword } = require("../base");

module.exports = [
  ...validateSmallStringBody({
    field: "token",
    fieldName: "Token",
  }),
  ...validatePassword({ field: "password", fieldName: "Password" }),
];
