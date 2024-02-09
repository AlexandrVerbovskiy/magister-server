require("dotenv").config();
const jwt = require("jsonwebtoken");
const STATIC = require("../static");

module.exports = function (body) {
  const duration = STATIC.JWT_VERIFY_LIFETIME;

  return jwt.sign(body, process.env.JWT_SECRET_KEY, {
    expiresIn: duration,
  });
};
