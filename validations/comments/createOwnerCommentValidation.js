const { body } = require("express-validator");
const createUserCommentValidation = require("./createUserCommentValidation");

module.exports = [
  ...createUserCommentValidation,

  body("listingCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("listingCommentInfo.punctuality")
    .isInt({ min: 1, max: 5 })
    .withMessage("Punctuality must be a number between 1 and 5")
    .toInt(),
  body("listingCommentInfo.communication")
    .isInt({ min: 1, max: 5 })
    .withMessage("Communication must be a number between 1 and 5")
    .toInt(),
  body("listingCommentInfo.flexibility")
    .isInt({ min: 1, max: 5 })
    .withMessage("Flexibility must be a number between 1 and 5")
    .toInt(),
  body("listingCommentInfo.reliability")
    .isInt({ min: 1, max: 5 })
    .withMessage("Reliability must be a number between 1 and 5")
    .toInt(),
  body("listingCommentInfo.kindness")
    .isInt({ min: 1, max: 5 })
    .withMessage("Kindness must be a number between 1 and 5")
    .toInt(),
  body("listingCommentInfo.generalExperience")
    .isInt({ min: 1, max: 5 })
    .withMessage("General experience must be a number between 1 and 5")
    .toInt(),
];
