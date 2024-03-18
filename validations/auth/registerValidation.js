const {
  validateCheckbox,
  validateSmallStringBody,
  emailValidation,
  validatePassword,
} = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "name", fieldName: "Name" }),
  ...validateCheckbox({
    field: "acceptedTermCondition",
    fieldName: "Accept term condition",
    message: "To use the site, you must accept our term & condition",
  }),
  ...emailValidation,
  ...validatePassword({ field: "password", fieldName: "Password" }),
];
