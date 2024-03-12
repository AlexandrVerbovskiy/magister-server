const { userRoleValidation } = require("../base");
const idBodyValidation = require("./idBodyValidation");

module.exports = [...idBodyValidation, ...userRoleValidation];
