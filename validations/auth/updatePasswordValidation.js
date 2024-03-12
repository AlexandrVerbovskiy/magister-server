const { validatePassword } = require("../base");

module.exports = [
  ...validatePassword({ field: "newPassword", fieldName: "Password" }),
  ...validatePassword({ field: "currentPassword", fieldName: "Current Password" }),
];
