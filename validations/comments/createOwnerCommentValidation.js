const { body } = require("express-validator");
const starValidation = require("./starValidation");

module.exports = [
  body("orderId").isInt().withMessage("Order Id must be a number").toInt(),

  body("userCommentInfo.description")
    .isString()
    .withMessage("User comment description must be a string")
    .notEmpty()
    .withMessage("User comment description cannot be empty"),

  body("userCommentInfo.leaveFeedback")
    .isString()
    .withMessage("User comment leave feedback must be a string"),

  ...starValidation({
    field: "userCommentInfo.itemDescriptionAccuracy",
    name: "User comment item description accuracy",
  }),
  ...starValidation({
    field: "userCommentInfo.photoAccuracy",
    name: "User comment photo accuracy",
  }),
  ...starValidation({
    field: "userCommentInfo.pickupCondition",
    name: "User comment pickup condition",
  }),
  ...starValidation({
    field: "userCommentInfo.cleanliness",
    name: "User comment cleanliness",
  }),
  ...starValidation({
    field: "userCommentInfo.responsiveness",
    name: "User comment responsiveness",
  }),
  ...starValidation({
    field: "userCommentInfo.clarity",
    name: "User comment clarity",
  }),
  ...starValidation({
    field: "userCommentInfo.schedulingFlexibility",
    name: "User comment scheduling flexibility",
  }),
  ...starValidation({
    field: "userCommentInfo.issueResolution",
    name: "User comment issue resolution",
  }),
];
