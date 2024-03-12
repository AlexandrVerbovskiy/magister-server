const {
  listPaginationFilterValidation,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...listPaginationFilterValidation,
  ...validateSmallStringBody({
    field: "accepted",
    fieldName: "Accepted",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "viewed",
    fieldName: "Viewed",
    required: false,
  }),
];
