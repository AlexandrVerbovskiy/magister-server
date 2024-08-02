const { validateIdBody, validateIntegerBody } = require("../base");

module.exports = [
  ...validateIdBody(),
  ...validateIntegerBody({
    field: "lastMessageId",
    fieldName: "Last Message Id",
    required: false,
  }),
];
