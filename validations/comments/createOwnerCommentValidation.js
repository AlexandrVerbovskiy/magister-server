const { body } = require("express-validator");
const starValidation = require("./starValidation");

module.exports = [
  body("listingCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),

  ...starValidation({
    field: "listingCommentInfo.punctuality",
    name: "Punctuality",
  }),
  ...starValidation({
    field: "listingCommentInfo.communication",
    name: "Communication",
  }),
  ...starValidation({
    field: "listingCommentInfo.flexibility",
    name: "Flexibility",
  }),
  ...starValidation({
    field: "listingCommentInfo.reliability",
    name: "Reliability",
  }),
  ...starValidation({ field: "listingCommentInfo.kindness", name: "Kindness" }),
  ...starValidation({
    field: "listingCommentInfo.generalExperience",
    name: "General experience",
  }),

  body("userCommentInfo.description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("userCommentInfo.leaveFeedback")
    .isString()
    .withMessage("Leave feedback must be a string"),

  ...starValidation({ field: "userCommentInfo.itemDescriptionAccuracy", name: "Item description accuracy" }),
  ...starValidation({
    field: "userCommentInfo.photoAccuracy",
    name: "Photo accuracy",
  }),
  ...starValidation({
    field: "userCommentInfo.pickupCondition",
    name: "Pickup condition",
  }),
  ...starValidation({ field: "userCommentInfo.cleanliness", name: "Cleanliness" }),
  ...starValidation({
    field: "userCommentInfo.responsiveness",
    name: "Responsiveness",
  }),
  ...starValidation({
    field: "userCommentInfo.clarity",
    name: "Clarity",
  }),
  ...starValidation({ field: "userCommentInfo.schedulingFlexibility", name: "Scheduling flexibility" }),
  ...starValidation({
    field: "userCommentInfo.issueResolution",
    name: "Issue resolution",
  }),
];
