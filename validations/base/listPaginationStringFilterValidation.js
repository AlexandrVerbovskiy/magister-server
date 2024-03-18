const { validateSmallStringBody } = require("./validateString");
const listPaginationFilterValidation = require("./listPaginationFilterValidation");

module.exports = [
  ...validateSmallStringBody({
    field: "filter",
    fieldName: "Filter",
    required: false,
  }),
  ...listPaginationFilterValidation,
];
