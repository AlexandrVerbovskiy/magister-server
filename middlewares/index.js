module.exports = {
  isAuth: require("./isAuth"),
  isNotAuth: require("./isNotAuth"),
  isAdmin: require("./isAdmin"),
  isSupport: require("./isSupport"),
  ...require("./isFileLimit"),
  isVerified: require("./isVerified"),
  isUnverified: require("./isUnverified"),
  authId: require("./authId"),
  isVerifiedAndHasPaypalId: require("./isVerifiedAndHasPaypalId"),
};
