const { body } = require("express-validator");

module.exports = ({ field, name }) => {
  return [
    body(field)
      .isInt({ min: 1, max: 5 })
      .withMessage(`${name} must be a number between 1 and 5`)
      .toInt(),
  ];
};
