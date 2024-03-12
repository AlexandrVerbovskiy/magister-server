const { validateIntegerBody } = require("../base");

const createValidation = require("./createValidation");

module.exports = [
  ...createValidation,
  ...validateIntegerBody({ field: "id", fieldName: "id" }),
];
