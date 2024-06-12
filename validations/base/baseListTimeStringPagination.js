const { validateSmallStringBody } = require("./validateString");
const listPaginationFilterValidation = require("./listPaginationFilterValidation");
const listTimeStringValidation = require("./listTimeStringValidation");

module.exports = [
  ...listTimeStringValidation,
  ...listPaginationFilterValidation,
];
