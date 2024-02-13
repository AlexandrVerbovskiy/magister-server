module.exports = {
  registerValidation: require("./registerValidation"),
  loginValidation: require("./loginValidation"),
  passwordValidation: require("./passwordValidation"),
  updatePasswordValidation: require("./updatePasswordValidation"),
  twoFactorAuthGenerateValidation: require("./twoFactorAuthGenerateValidation"),
  twoFactorAuthVerifyValidation: require("./twoFactorAuthVerifyValidation"),
  verifyEmailValidation: require("./verifyEmailValidation"),
  resetPasswordValidation: require("./resetPasswordValidation"),
  codeValidation: require("./codeValidation"),
  updateShortInfoValidation: require("./updateShortInfoValidation"),
  getTokenByProviderValidation: require("./getTokenByProviderValidation"),
};
