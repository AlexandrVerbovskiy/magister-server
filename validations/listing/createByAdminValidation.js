const { validateIntegerBody, validateBoolean } = require("../base");

const createValidation = require("./createValidation");

module.exports = [
  ...createValidation,
  ...validateIntegerBody({ field: "ownerId", fieldName: "Owner id" }),
  ...validateBoolean({ field: "approved", fieldName: "Approved" }),
];
