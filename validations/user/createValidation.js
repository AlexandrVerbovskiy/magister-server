const {
  validateSmallStringBody,
  validateBigStringBody,
  userRoleValidation,
  validateIntegerBody,
} = require("../base");

module.exports = [
  ...userRoleValidation,
  ...validateSmallStringBody({
    field: "name",
    fieldName: "Name",
  }),
  ...validateSmallStringBody({
    field: "phone",
    fieldName: "Phone",
    required: false,
  }),
  ...validateBigStringBody({
    field: "contactDetails",
    fieldName: "Contact Details",
    required: false,
  }),
  ...validateBigStringBody({
    field: "briefBio",
    fieldName: "Brief Bio",
    required: false,
  }),
  ...validateBigStringBody({
    field: "placeWork",
    fieldName: "Place Work",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "facebookUrl",
    fieldName: "Facebook Url",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "instagramUrl",
    fieldName: "Instagram Url",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "linkedinUrl",
    fieldName: "Linkedin Url",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "twitterUrl",
    fieldName: "Twitter Url",
    required: false,
  }),
  ...validateSmallStringBody({ field: "paypalId", fieldName: "Paypal Id" }),
];
