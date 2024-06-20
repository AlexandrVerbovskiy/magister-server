const { validateIntegerParam } = require("../base");

module.exports = [
  ...validateIntegerParam({
    field: "id",
    fieldName: "Id",
    required: false,
  }),
];
