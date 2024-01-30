const { body } = require("express-validator");

module.exports = [
  body("name").isLength({ min: 1 }).withMessage("Name is a required field"),
  body("acceptedTermCondition")
    .custom((value) => {
      if (value !== true) {
        throw new Error(
          "To use the site, you must accept our term & condition"
        );
      }
      return true;
    })
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("To use the site, you must accept our term & condition"),
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is a required field")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
];
