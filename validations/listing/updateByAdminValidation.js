const { validateIntegerBody } = require("../base");

const createByAdminValidation = require("./createByAdminValidation");

module.exports = [
  ...createByAdminValidation,
  ...validateIntegerBody({ field: "id", fieldName: "id" }),
];
