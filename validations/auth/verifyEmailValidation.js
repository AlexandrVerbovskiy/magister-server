const { validateSmallStringBody, emailValidation } = require("../base");

module.exports = [
  ...emailValidation,
  ...validateSmallStringBody({
    field: "code",
    fieldName: "code",
  }),
];
