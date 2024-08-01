const {
  baseListTimeStringFilterPagination,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...baseListTimeStringFilterPagination,
  ...validateSmallStringBody({ field: "type", fieldName: "Type" }),
  ...validateSmallStringBody({ field: "status", fieldName: "Status" }),
];
