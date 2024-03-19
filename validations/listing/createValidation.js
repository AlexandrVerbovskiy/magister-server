const { body } = require("express-validator");
const {
  validateSmallStringBody,
  validateIntegerBody,
  validateBigStringBody,
  validateFloat,
} = require("../base");

module.exports = [
  ...validateSmallStringBody({ field: "name", fieldName: "Name" }),
  ...validateIntegerBody({ field: "categoryId", fieldName: "Category id" }),

  ...validateIntegerBody({
    field: "countStoredItems",
    fieldName: "Count stored items",
  }),
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
  ...validateBigStringBody({
    field: "rentalTerms",
    fieldName: "Rental terms",
    required: false,
  }),
  ...validateBigStringBody({
    field: "keyWords",
    fieldName: "Key words",
    required: false,
  }),
  ...validateSmallStringBody({ field: "rentalLat", fieldName: "Rental lat" }),
  ...validateSmallStringBody({ field: "rentalLng", fieldName: "Rental lng" }),
  ...validateSmallStringBody({ field: "city", fieldName: "City" }),
  ...validateSmallStringBody({ field: "postcode", fieldName: "Postcode" }),
  ...validateFloat({ field: "rentalRadius", fieldName: "Rental radius" }),
  ...validateFloat({
    field: "compensationCost",
    fieldName: "Compensation radius",
  }),
  ...validateFloat({ field: "pricePerDay", fieldName: "Price per day" }),
  ...validateIntegerBody({
    field: "minimumRentalDays",
    fieldName: "Minimum rental days",
    required: false,
  }),
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
        });

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
];
