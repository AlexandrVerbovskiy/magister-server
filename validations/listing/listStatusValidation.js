const {
  validateSmallStringBody,
  listPaginationStringFilterValidation,
} = require("../base");

module.exports = [
  ...validateSmallStringBody({
    field: "status",
    fieldName: "Status",
    required: false,
  }),
  ...listPaginationStringFilterValidation,
];
