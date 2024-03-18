const createValidation = require("./createValidation");
const idBodyValidation = require("./idBodyValidation");

module.exports = [...idBodyValidation, ...createValidation];
