const loginValidation = require("./loginValidation");
const typeValidation = require("./typeValidation");

module.exports = [
  ...loginValidation,
  ...typeValidation({ field: "type", fieldName: "Type" }),
];
