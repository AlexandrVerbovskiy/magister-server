const typeValidation = require("./typeValidation");
const { validateSmallStringBody, validateIdBody } = require("../base");

module.exports = [
  ...typeValidation,
  ...validateSmallStringBody({ field: "code", fieldName: "Code" }),
  ...validateIdBody(),
];
