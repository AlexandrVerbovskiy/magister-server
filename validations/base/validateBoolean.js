const { body } = require("express-validator");

module.exports = ({ field, fieldName = null, message = null }) => {
  if (!message)
    message = `Body parameter '${fieldName ?? field}' must be boolean`;

  return [body(field).isBoolean().withMessage(message)];
};
