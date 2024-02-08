const { body } = require("express-validator");
const emailValidation = require("./emailValidation");
const passwordValidation = require("./passwordValidation");
const acceptedTermConditionValidation = require("./acceptedTermConditionValidation");

module.exports = [
  body("name").isLength({ min: 1 }).withMessage("Name is a required field"),
  acceptedTermConditionValidation,
  emailValidation,
  passwordValidation,
];
