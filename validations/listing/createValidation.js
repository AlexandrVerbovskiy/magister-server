const { body } = require("express-validator");
const {
  validateSmallStringBody,
  validateIntegerBody,
  validateBigStringBody,
  validateFloat,
  validateDateTime,
} = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "name", fieldName: "Name" }),
  body("otherCategory").custom((value, { req }) => {
    if (value && value.length > 0) {
      req.skipCategoryId = true;
      return true;
    }
    req.skipCategoryId = false;
    return true;
  }),

  body("categoryId")
    .if((value, { req }) => !req.skipCategoryId)
    .exists()
    .withMessage("Category id is required")
    .bail()
    .isInt()
    .withMessage("Category id must be an integer"),
  ...validateBigStringBody({
    field: "description",
    fieldName: "Description",
    required: false,
  }),
  ...validateBigStringBody({
    field: "address",
    fieldName: "address",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "otherCategory",
    fieldName: "Other Category",
    required: false,
  }),
  ...validateFloat({
    field: "lat",
    fieldName: "Lat",
    canBeNegative: true,
  }),
  ...validateFloat({
    field: "lng",
    fieldName: "Lng",
    canBeNegative: true,
  }),
  ...validateFloat({ field: "price", fieldName: "Price" }),
  ...validateSmallStringBody({ field: "city", fieldName: "City" }),
  ...validateSmallStringBody({ field: "postcode", fieldName: "Postcode" }),
  ...validateFloat({ field: "radius", fieldName: "radius" }),
  body("listingImages")
    .optional({ nullable: true })
    .custom((value) => {
      try {
        const images = JSON.parse(value);
        if (!Array.isArray(images)) {
          throw new Error(
            "Field 'listingImages' must be an array with at least one element"
          );
        }

        images.forEach((image) => {
          if (!image.type) {
            throw new Error(
              "Each 'type' field in 'listingImages' must not be empty"
            );
          }
          if (!image.link) {
            throw new Error(
              "Each 'link' field in 'listingImages' must not be empty"
            );
          }

          if (image.type == "url" && image.link.length > 2000) {
            throw new Error("No image link can be longer than 2000 characters");
          }
        });

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
];
