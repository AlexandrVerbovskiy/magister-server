const { body } = require("express-validator");

module.exports = [
  body("orderId").isInt().withMessage("orderId must be a number").toInt(),

  body("ownerCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("ownerCommentInfo.quality")
    .isInt({ min: 1, max: 5 })
    .withMessage("Quality must be a number between 1 and 5")
    .toInt(),
  body("ownerCommentInfo.listingAccuracy")
    .isInt({ min: 1, max: 5 })
    .withMessage("Listing accuracy must be a number between 1 and 5")
    .toInt(),
  body("ownerCommentInfo.utility")
    .isInt({ min: 1, max: 5 })
    .withMessage("Utility must be a number between 1 and 5")
    .toInt(),
  body("ownerCommentInfo.condition")
    .isInt({ min: 1, max: 5 })
    .withMessage("Condition must be a number between 1 and 5")
    .toInt(),
  body("ownerCommentInfo.performance")
    .isInt({ min: 1, max: 5 })
    .withMessage("Performance must be a number between 1 and 5")
    .toInt(),
  body("ownerCommentInfo.location")
    .isInt({ min: 1, max: 5 })
    .withMessage("Location must be a number between 1 and 5")
    .toInt(),
];
