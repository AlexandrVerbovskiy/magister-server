const { body } = require("express-validator");

module.exports = ({ field, fieldName = null, message = null }) => {
  if (!message)
    message = `Body parameter '${
      fieldName ?? field
    }' is required and must be 'true'`;

  return [
    body(field)
      .custom((value) => {
        if (value != true) {
          throw new Error(message);
        }
        return true;
      })
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage(message),
  ];
};
