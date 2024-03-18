const { body } = require("express-validator");
const { validateSmallStringBody } = require("../base");

module.exports = [
  validateSmallStringBody({ field: "name", fieldName: "Name" }),
  body("level")
    .isInt({ min: 1, max: 3 })
    .withMessage("Body field 'Level' must be an integer between 1 and 3"),
  body("parentId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Field 'Parent id' must be an integer greater than 0"),
  body("searchedWordId")
    .isInt({ min: 1 })
    .withMessage("Field 'Searched word id' must be an integer greater than 0"),
];
