const listTimeStringValidation = require("./listTimeStringValidation");
const listPaginationStringFilterValidation = require("./listPaginationStringFilterValidation");

module.exports = [
  ...listPaginationStringFilterValidation,
  ...listTimeStringValidation,
];
