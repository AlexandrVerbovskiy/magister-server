const { body } = require("express-validator");

module.exports = [
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
];
