const typeValidation = require("./typeValidation");
const { validateSmallStringBody, validateIdBody } = require("../base");

module.exports = [
  ...typeValidation({ field: "type", fieldName: "Type" }),
  ...validateSmallStringBody({ field: "code", fieldName: "Code" }),
  ...validateIdBody(),
];
