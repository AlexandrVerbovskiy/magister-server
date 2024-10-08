const {
  validateSmallStringBody,
  validateBigStringBody,
  validatePhone,
  validateUrl,
} = require("../base");

module.exports = [
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
  ...validateUrl({
    field: "facebookUrl",
    fieldName: "Facebook Url",
    required: false,
  }),
  ...validateUrl({
    field: "instagramUrl",
    fieldName: "Instagram Url",
    required: false,
  }),
  ...validateUrl({
    field: "linkedinUrl",
    fieldName: "Linkedin Url",
    required: false,
  }),
];
