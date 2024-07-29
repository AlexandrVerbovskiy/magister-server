const { Router } = require("express");
const router = Router();
const {
  isAuth,
  isNotAuth,
  isFileLimit,
  isUnverified,
  isSummaryFileLimit,
} = require("../../middlewares");
const { UserController } = require("../../controllers");
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  twoFactorAuthGenerateValidation,
  twoFactorAuthVerifyValidation,
  verifyEmailValidation,
  resetPasswordValidation,
  codeValidation,
  authByProviderValidation,
  saveProfileValidation,
  autofillValidation,
} = require("../../validations/auth");

const { upload } = require("../../utils");
const { emailValidation } = require("../../validations/base");

module.exports = (io) => {
  const userController = new UserController(io);

  router.post(
    "/register",
    isNotAuth,
    registerValidation,
    userController.register
  );

  router.post(
    "/verify-email",
    isNotAuth,
    verifyEmailValidation,
    userController.verifyEmail
  );

  router.post("/login", isNotAuth, loginValidation, userController.login);

  router.post(
    "/generate-two-factor-code",
    isNotAuth,
    twoFactorAuthGenerateValidation,
    userController.twoFactorAuthGenerate
  );
  router.post(
    "/check-two-factor-code",
    isNotAuth,
    twoFactorAuthVerifyValidation,
    userController.twoFactorAuthVerify
  );

  router.get("/my-info", isAuth, userController.myInfo);

  router.post(
    "/save-profile",
    upload.single("photo"),
    isFileLimit,
    isAuth,
    saveProfileValidation,
    userController.saveProfile
  );

  router.post(
    "/update-my-password",
    isAuth,
    updatePasswordValidation,
    userController.updateMyPassword
  );

  router.post(
    "/save-my-documents",
    isAuth,
    upload.any(),
    isSummaryFileLimit,
    isFileLimit,
    userController.updateMyDocuments
  );

  router.post(
    "/reset-password-send",
    isNotAuth,
    emailValidation,
    userController.resetPassword
  );

  router.post(
    "/reset-password",
    isNotAuth,
    resetPasswordValidation,
    userController.setNewPassword
  );

  router.post(
    "/generate-my-phone-code",
    isAuth,
    userController.sendVerifyPhone
  );

  router.post(
    "/generate-my-email-code",
    isNotAuth,
    emailValidation,
    userController.sendVerifyEmail
  );

  router.post(
    "/check-my-phone-code",
    isAuth,
    codeValidation,
    userController.verifyPhone
  );

  router.post(
    "/change-two-factor-auth",
    isAuth,
    userController.changeTwoFactorAuth
  );

  router.post(
    "/auth-by-provider",
    isNotAuth,
    authByProviderValidation,
    userController.authByProvider
  );

  return router;
};
