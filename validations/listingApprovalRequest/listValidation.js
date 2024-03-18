const {
  validateSmallStringBody,
  listPaginationTimeStringFilterValidation,
} = require("../base");

module.exports = [
  ...validateSmallStringBody({
    field: "status",
    fieldName: "Status",
    required: false,
  }),
  ...listPaginationTimeStringFilterValidation,
];
