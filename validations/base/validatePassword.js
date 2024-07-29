const { body } = require("express-validator");

module.exports = ({ field, fieldName = null }) => {
  return [
    body(field)
      .isLength({ min: 8 })
      .withMessage(
        `body parameter '${
          fieldName ?? field
        }' must contain at least 8 characters`
      )
      .isLength({ max: 255 })
      .withMessage(
        `body parameter '${fieldName ?? field}' must be lower than 255 symbols`
      )
      .matches(/[a-z]/)
      .withMessage(
        `body parameter '${
          fieldName ?? field
        }' must contain at least one lowercase letter`
      )
      .matches(/[A-Z]/)
      .withMessage(
        `body parameter '${
          fieldName ?? field
        }' must contain at least one uppercase letter`
      )
      .matches(/\d/)
      .withMessage(
        `body parameter '${fieldName ?? field}' must contain at least one digit`
      ),
    /*.matches(/[!@#$%^&*+=]/)
      .withMessage(
        `body parameter '${fieldName ?? field}' must contain at least one special character (!@#$%^&*+=)`
      )*/
  ];
};
