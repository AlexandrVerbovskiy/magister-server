require("dotenv").config();
const jwt = require("jsonwebtoken");
const STATIC = require("../static");

module.exports = function (userId, remember = false) {
  const duration = remember
    ? STATIC.JWT_REMEMBER_ACCESS_LIFETIME
    : STATIC.JWT_DEFAULT_ACCESS_LIFETIME;

  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: duration,
  });
};
