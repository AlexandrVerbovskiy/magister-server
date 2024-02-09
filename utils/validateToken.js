require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};
