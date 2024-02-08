const { body } = require("express-validator");
const emailValidation = require("./emailValidation");
const passwordValidation = require("./passwordValidation");

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
  emailValidation,
  passwordValidation,
];
