require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function (token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken.userId ?? null;
  } catch (error) {
    return null;
  }
};
