const { body } = require("express-validator");

module.exports = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
  body("currentPassword")
    .isLength({ min: 8 })
    .withMessage("Current Password must contain at least 8 characters"),
];
