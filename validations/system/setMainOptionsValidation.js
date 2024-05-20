const { validateBoolean } = require("../base");
const { body } = require("express-validator");

module.exports = [
  ...validateBoolean({
    field: "userLogActive",
    fieldName: "User sog Active",
  }),
];
