const { body } = require("express-validator");
const { validateSmallStringBody } = require("../base");

module.exports = [
  body("categoriesToSave")
    .optional()
    .isObject()
    .withMessage("Body field 'categoriesToSave' must be an object"),
  body("categoriesToReplace")
    .optional()
    .isArray()
    .withMessage("Body field 'categoriesToReplace' must be an array"),
  body("categoriesToReplace.*.newLevel")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "Each 'newLevel' in 'categoriesToReplace' must be a positive integer"
    ),
  ...validateSmallStringBody({
    field: "categoriesToSave.*.*.name",
    fieldName: "'Name' in 'Categories to replace'",
    required: true,
  }),
  ...validateSmallStringBody({
    field: "categoriesToReplace.*.newName",
    fieldName: "'New Name' in 'Categories to replace'",
    required: false,
  }),
];
