const { validateBoolean, validateIdBody } = require("../base");

module.exports = [
  ...validateIdBody("Request wasn't found"),
  ...validateBoolean({ field: "verified", fieldName: "Verified" }),
];
