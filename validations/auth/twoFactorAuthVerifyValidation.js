const { validateSmallStringBody } = require("../base");
const { validateIntegerBody } = require("../base/validateInteger");

module.exports = [
  ...validateSmallStringBody({ field: "type", fieldName: "Type" }),
  ...validateSmallStringBody({ field: "code", fieldName: "Code" }),
  ...validateIntegerBody({field:"id", fieldName:"Id"})
];
