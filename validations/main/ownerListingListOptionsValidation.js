const { validateIntegerBody } = require("../base");
const { listValidation } = require("../listing");

module.exports = [
  ...listValidation,
  ...validateIntegerBody({ field: "ownerId", fieldName: "Owner Id" }),
];