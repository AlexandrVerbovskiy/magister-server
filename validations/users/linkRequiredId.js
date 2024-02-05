const { param } = require("express-validator");

module.exports = [param("id").isInt().withMessage("Id must be an integer")];
