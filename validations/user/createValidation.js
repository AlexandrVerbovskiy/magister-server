const {
  validateSmallStringBody,
  validateBigStringBody,
  userRoleValidation,
  validatePhone,
} = require("../base");

module.exports = [
  ...userRoleValidation,
  ...validateSmallStringBody({
    field: "name",
    fieldName: "Name",
  }),
  ...validatePhone({
    field: "phone",
    fieldName: "Phone",
    required: false,
  }),
  ...validateBigStringBody({
    field: "briefBio",
    fieldName: "Brief Bio",
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
    field: "paypalId",
    fieldName: "Paypal Id",
    required: false,
  }),
];
