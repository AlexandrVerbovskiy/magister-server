const {
  listPaginationFilterValidation,
  listPaginationTimeStringFilterValidation,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...listPaginationTimeStringFilterValidation,
  ...listPaginationFilterValidation,
  ...validateSmallStringBody({
    field: "status",
    fieldName: "Status",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "type",
    fieldName: "Type",
    required: false,
  }),
];
