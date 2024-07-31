const { body } = require("express-validator");

module.exports = ({ field, fieldName = null, required = true }) => {
  let validation = body(field)
    .isString()
    .withMessage(`body parameter '${fieldName ?? field}' must be a string`)
    .matches(/^[0-9]+$/)
    .withMessage(
      `body parameter '${fieldName ?? field}' should contain only digits`
    )
    .isLength({ min: 10 })
    .withMessage(
      `body parameter '${
        fieldName ?? field
      }' should have a minimum of 10 digits`
    )
    .custom((value) => {
      if (value && value.trim() && value.length > 250) {
        throw new Error("length exceeds 250 characters");
      }
      return true;
    });

  if (!required) {
    validation = validation.optional();
  }

  return [validation];
};
