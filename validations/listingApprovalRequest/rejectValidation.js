const { validateBigStringBody } = require("../base");
const idValidation = require("./idValidation");

module.exports = [
  ...idValidation,
  ...validateBigStringBody({ field: "description", fieldName: "Description" }),
];
