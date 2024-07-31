module.exports = {
  ...require("./validateInteger"),
  ...require("./validateId"),
  ...require("./validateString"),
  validatePhone: require("./validatePhone"),
  validateUrl: require("./validateUrl"),
  validateCheckbox: require("./validateCheckbox"),
  validateFloat: require("./validateFloat"),
  validateDate: require("./validateDate"),
  validateBoolean: require("./validateBoolean"),
  userRoleValidation: require("./userRoleValidation"),
  emailValidation: require("./emailValidation"),
  validatePassword: require("./validatePassword"),
  listTimeStringValidation: require("./listTimeStringValidation"),
  listPaginationStringFilterValidation: require("./listPaginationStringFilterValidation"),
  listPaginationFilterValidation: require("./listPaginationFilterValidation"),
  listPaginationTimeStringFilterValidation: require("./listPaginationTimeStringFilterValidation"),
  baseListTimeStringFilterPagination: require("./baseListTimeStringFilterPagination"),
  baseListTimeStringPagination: require("./baseListTimeStringPagination"),
};
