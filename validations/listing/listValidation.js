const { body } = require("express-validator");
const {
  listPaginationStringFilterValidation,
  validateIntegerBody,
  validateFloat,
  validateSmallStringBody,
  validateBoolean,
} = require("../base");

module.exports = [
  ...listPaginationStringFilterValidation,
  body("cities")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Field 'Cities' must be an array"),
  body("categories")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Field 'Categories' must be an array"),
  ...validateIntegerBody({
    field: "distance",
    fieldName: "Distance",
    required: false,
  }),
  ...validateFloat({
    field: "lat",
    fieldName: "Lat",
    required: false,
    canBeNegative: true,
  }),
  ...validateFloat({
    field: "lng",
    fieldName: "Lng",
    required: false,
    canBeNegative: true,
  }),
  ...validateFloat({
    field: "minPrice",
    fieldName: "Min Price",
    required: false,
  }),
  ...validateFloat({
    field: "maxPrice",
    fieldName: "Max Price",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "searchCategory",
    fieldName: "Search Category",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "searchCity",
    fieldName: "Search searchCity",
    required: false,
  }),
  ...validateIntegerBody({
    field: "ownerId",
    fieldName: "Owner Id",
    required: false,
  }),
  ...validateBoolean({
    field: "totalOthersCategories",
    fieldName: "Total Others Categories",
    required: false,
  }),
  ...validateBoolean({
    field: "favorites",
    fieldName: "Favorites",
    required: false,
  }),
];
