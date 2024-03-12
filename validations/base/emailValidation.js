const { body } = require("express-validator");

module.exports = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Body parameter 'Email' is a required field")
    .isLength({ max: 255 })
    .withMessage("Body parameter 'Email' must be lower than 255 symbols")
    .isEmail()
    .withMessage("Please enter a valid body parameter 'Email'"),
];
