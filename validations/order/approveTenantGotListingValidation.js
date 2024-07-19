const { validateSmallStringBody, validateBigStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
  ...validateBigStringBody({
    field: "defectDescription",
    fieldName: "Defect Description",
    required: false
  }),
];
