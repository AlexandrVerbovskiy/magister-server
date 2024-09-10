const { body } = require("express-validator");
const { isValidPhoneNumber } = require("libphonenumber-js");

module.exports = ({ field, fieldName = null, required = true }) => {
  let validation = body(field)
    .isString()
    .withMessage(`body parameter '${fieldName ?? field}' must be a string`)
    .matches(/^[0-9]+$/)
    .withMessage(
      `body parameter '${fieldName ?? field}' should contain only digits`
    )
    .custom((value) => {
      if (value && value.trim() && value.length > 250) {
        throw new Error("length exceeds 250 characters");
      }

      if (!isValidPhoneNumber("+" + value)) {
        throw new Error(
          `body parameter '${fieldName ?? field}' is not a valid phone number`
        );
      }

      return true;
    });

  if (!required) {
    validation = validation.optional();
  }

  return [validation];
};
