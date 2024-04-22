const listValidation = require("./listValidation");
const { validateIntegerBody } = require("../base");

module.exports = [
  ...listValidation,
  ...validateIntegerBody({ field: "ownerId", fieldName: "Owner Id" }),
];
