const {
  baseListTimeStringFilterPagination,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...baseListTimeStringFilterPagination,
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
