const { body } = require("express-validator");

module.exports = [
  body("orderId").isInt().withMessage("orderId must be a number").toInt(),

  body("userCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("userCommentInfo.quality")
    .isInt({ min: 1, max: 5 })
    .withMessage("Quality must be a number between 1 and 5")
    .toInt(),
  body("userCommentInfo.listingAccuracy")
    .isInt({ min: 1, max: 5 })
    .withMessage("Listing accuracy must be a number between 1 and 5")
    .toInt(),
  body("userCommentInfo.utility")
    .isInt({ min: 1, max: 5 })
    .withMessage("Utility must be a number between 1 and 5")
    .toInt(),
  body("userCommentInfo.condition")
    .isInt({ min: 1, max: 5 })
    .withMessage("Condition must be a number between 1 and 5")
    .toInt(),
  body("userCommentInfo.performance")
    .isInt({ min: 1, max: 5 })
    .withMessage("Performance must be a number between 1 and 5")
    .toInt(),
  body("userCommentInfo.location")
    .isInt({ min: 1, max: 5 })
    .withMessage("Location must be a number between 1 and 5")
    .toInt(),
];
