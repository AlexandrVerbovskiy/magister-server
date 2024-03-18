const { validateSmallStringBody } = require("../base");

module.exports = validateSmallStringBody({
  field: "categoryName",
  fieldName: "Category Name",
});
