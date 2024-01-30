const crypto = require('crypto');

module.exports = function (length = 10) {
  return crypto.randomBytes(length).toString("hex");
};
