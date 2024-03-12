const { validateSmallStringBody } = require("./validateString");

module.exports = validateSmallStringBody({
  field: "token",
  fieldName: "Token",
});
