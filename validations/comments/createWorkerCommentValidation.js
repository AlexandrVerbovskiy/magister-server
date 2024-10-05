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
    
  ...starValidation({ field: "userCommentInfo.care", name: "User comment care" }),
  ...starValidation({ field: "userCommentInfo.timeliness", name: "User comment timeliness" }),
  ...starValidation({ field: "userCommentInfo.responsiveness", name: "User comment responsiveness" }),
  ...starValidation({ field: "userCommentInfo.clarity", name: "User comment clarity" }),
  ...starValidation({ field: "userCommentInfo.usageGuidelines", name: "User comment usage guidelines" }),
  ...starValidation({ field: "userCommentInfo.termsOfService", name: "User comment terms of service" }),
  ...starValidation({ field: "userCommentInfo.honesty", name: "User comment honesty" }),
  ...starValidation({ field: "userCommentInfo.reliability", name: "User comment reliability" }),
  ...starValidation({ field: "userCommentInfo.satisfaction", name: "User comment satisfaction" }),
];
