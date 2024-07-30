const createValidation = require("./createValidation");
const { validateIntegerBody } = require("../base");

module.exports = [
  ...validateIntegerBody({
    field: "parentOrderId",
    fieldName: "Parent Order Id",
  }),
  ...createValidation,
];
