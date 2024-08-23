const { validateSmallStringBody, validateBigStringBody } = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "token", fieldName: "Token" }),
  ...validateBigStringBody({
    field: "itemMatchesDescription",
    fieldName: "Item matches description",
    required: false,
  }),
  ...validateBigStringBody({
    field: "itemMatchesPhotos",
    fieldName: "Item matches photos",
    required: false,
  }),
  ...validateBigStringBody({
    field: "itemFullyFunctional",
    fieldName: "Item fully functional",
    required: false,
  }),
  ...validateBigStringBody({
    field: "partsGoodCondition",
    fieldName: "Parts good condition",
    required: false,
  }),
  ...validateBigStringBody({
    field: "providedGuidelines",
    fieldName: "Provided guidelines",
    required: false,
  }),
];
