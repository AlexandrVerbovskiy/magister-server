const { body } = require("express-validator");

module.exports = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) => {
  if (!message)
    message = `Body parameter '${
      fieldName ?? field
    }' must be a float number greater than or equal to 0`;

  let validation = body(field);
  if (!required) validation = validation.optional({ nullable: true });

  validation = validation.isFloat({ min: 0 }).withMessage(message);
  return [validation];
};
