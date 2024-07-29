const { body } = require("express-validator");

module.exports = ({ field, fieldName = null }) => {
  return [
    body(field)
      .isString()
      .withMessage(`Body parameter '${fieldName ?? field}' must be a string`)
      .custom((value) => {
        const lowerCaseValue = value.toLowerCase();
        if (lowerCaseValue !== "email" && lowerCaseValue !== "phone") {
          throw new Error(
            `Body parameter '${
              fieldName ?? field
            }' must be either 'email' or 'phone'`
          );
        }
        return true;
      }),
  ];
};
