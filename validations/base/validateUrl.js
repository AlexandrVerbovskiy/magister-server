const { body } = require("express-validator");

module.exports = ({ field, fieldName = null, required = true }) => {
  let validation = body(field)
    .optional()
    .isString()
    .withMessage(`body parameter '${fieldName ?? field}' must be a string`)
    .custom((value) => {
      try {
        new URL(value);
      } catch (error) {
        throw new Error(
          `body parameter '${fieldName ?? field}' is an invalid URL`
        );
      }

      if (value && value.trim() && value.length > 250) {
        throw new Error(
          `body parameter '${fieldName ?? field}' length exceeds 250 characters`
        );
      }

      return true;
    });

  if (!required) {
    validation = validation.optional();
  }

  return [validation];
};
