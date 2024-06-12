const { validateSmallStringBody } = require("./validateString");
const baseListTimeStringPagination = require("./baseListTimeStringPagination");

module.exports = [
  ...validateSmallStringBody({
    field: "filter",
    fieldName: "Filter",
    required: false,
  }),
  ...baseListTimeStringPagination,
];
