const { body } = require("express-validator");

module.exports = ({ field, fieldName = null }) => {
  return [
    body(field)
      .isLength({ min: 8 })
      .withMessage(
        `Body parameter '${
          fieldName ?? field
        }' must contain at least 8 characters`
      )
      .isLength({ max: 255 })
      .withMessage(
        `Body parameter '${fieldName ?? field}' must be lower than 255 symbols`
      ),
  ];
};
