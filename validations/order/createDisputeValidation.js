const { validateBigStringBody } = require("../base");
const idBodyValidation = require("./idBodyValidation");

module.exports = [
  ...idBodyValidation(),
  ...validateBigStringBody({ field: "description", fieldName: "Description" }),
];
