const { emailValidation, validatePassword } = require("../base");

module.exports = [
  ...emailValidation,
  ...validatePassword({ field: "password", fieldName: "Password" }),
];
