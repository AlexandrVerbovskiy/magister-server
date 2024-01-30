require("dotenv").config();
const jwt = require("jsonwebtoken");
const STATIC = require("../static");

module.exports = function (userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: STATIC.JWT_ACCESS_LIFETIME,
  });
};
