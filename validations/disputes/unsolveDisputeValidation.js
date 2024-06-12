const { validateIntegerBody } = require("../base");

module.exports = [
  ...validateIntegerBody({
    field: "disputeId",
    fieldName: "Dispute Id",
  }),
];
