const { body } = require("express-validator");
const { listTimeStringValidation } = require("../base");

module.exports = [
  ...listTimeStringValidation,
  body("type")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || typeof value === "string") {
        return true;
      }
      throw new Error("Field 'Type' must be a string or null");
    }),
];
