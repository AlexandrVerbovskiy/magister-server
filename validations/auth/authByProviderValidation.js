const { body } = require("express-validator");
const emailValidation = require("./emailValidation");
const tokenValidation = require("./tokenValidation");

module.exports = [
    emailValidation,
    tokenValidation,
    body("name").isLength({ min: 1 }).withMessage("Name is a required field"),
    body("provider").isLength({ min: 1 }).withMessage("Provider is a required field"),
];
