const { validateSmallStringBody } = require("../base");
const questionValidation = require("./questionValidation");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
  ...questionValidation,
];
