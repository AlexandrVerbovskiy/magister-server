const { validateIntegerParam, validateIntegerBody } = require("./validateInteger");

const validateIdParam = (message = null) =>
  validateIntegerParam({ field: "id", fieldName: "Id", message });

const validateIdBody = (message = null) =>
  validateIntegerBody({ field: "id", fieldName: "Id", message });

  module.exports ={
    validateIdParam,
    validateIdBody
  }
