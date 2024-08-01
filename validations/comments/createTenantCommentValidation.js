const { body } = require("express-validator");
const starValidation = require("./starValidation");

module.exports = [
  body("orderId").isInt().withMessage("Order Id must be a number").toInt(),

  body("userCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("userCommentInfo.leaveFeedback")
    .isString()
    .withMessage("Leave feedback must be a string"),
    
  ...starValidation({ field: "userCommentInfo.care", name: "Care" }),
  ...starValidation({ field: "userCommentInfo.timeliness", name: "Timeliness" }),
  ...starValidation({ field: "userCommentInfo.responsiveness", name: "Responsiveness" }),
  ...starValidation({ field: "userCommentInfo.clarity", name: "Clarity" }),
  ...starValidation({ field: "userCommentInfo.usageGuidelines", name: "Usage guidelines" }),
  ...starValidation({ field: "userCommentInfo.termsOfService", name: "Terms of service" }),
  ...starValidation({ field: "userCommentInfo.honesty", name: "Honesty" }),
  ...starValidation({ field: "userCommentInfo.reliability", name: "Reliability" }),
  ...starValidation({ field: "userCommentInfo.satisfaction", name: "Satisfaction" }),
];
