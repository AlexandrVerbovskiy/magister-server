const { body } = require("express-validator");

module.exports = ({
  field,
  fieldName = null,
  message = null,
  required = true,
}) => {
  if (!message)
    message = `Body parameter '${fieldName ?? field}' must be boolean`;

  let validation = body(field);

  if (required) {
    validation
      .exists()
      .withMessage(`Body parameter '${fieldName ?? field}' is required`);
  }

  if (!required) {
    validation = validation.optional({ nullable: true });
  }

  validation.isBoolean().withMessage(message);

  return [validation];
};
