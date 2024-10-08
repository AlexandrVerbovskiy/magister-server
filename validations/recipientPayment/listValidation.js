const {
  listPaginationStringFilterValidation,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...listPaginationStringFilterValidation,
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
