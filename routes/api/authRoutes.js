const { Router } = require("express");
const router = Router();
const {
  isAuth,
  isNotAuth,
  isFileLimit,
  isUnverified,
} = require("../../middlewares");
const { userController } = require("../../controllers");
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
  typeValidation,
  checkTwoFactorCodeValidation,
} = require("../../validations/auth");

const { upload } = require("../../utils");

const { emailValidation } = require("../../validations/base");

router.post(
  "/register",
  isNotAuth,
  registerValidation,
  userController.register
);

router.post("/login", isNotAuth, loginValidation, userController.login);

router.post("/my-info", isAuth, userController.myInfo);
router.post(
  "/save-profile",
  upload.single("photo"),
  isFileLimit,
  isAuth,
  isFileLimit,
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
  isFileLimit,
  userController.updateMyDocuments
);

router.post(
  "/two-factor-auth-generate",
  isNotAuth,
  twoFactorAuthGenerateValidation,
  userController.twoFactorAuthGenerate
);

router.post(
  "/two-factor-auth-verify",
  twoFactorAuthVerifyValidation,
  userController.twoFactorAuthVerify
);

router.post(
  "/verify-email",
  isNotAuth,
  verifyEmailValidation,
  userController.verifyEmail
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

router.post("/generate-my-phone-code", isAuth, userController.sendVerifyPhone);

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
  "/generate-two-factor-code",
  isNotAuth,
  typeValidation,
  userController.twoFactorAuthGenerate
);
router.post(
  "/check-two-factor-code",
  isNotAuth,
  checkTwoFactorCodeValidation,
  userController.twoFactorAuthVerify
);

router.post(
  "/change-two-factor-auth",
  isAuth,
  userController.changeTwoFactorAuth
);

router.post(
  "/no-need-regular-view-info-form",
  isAuth,
  userController.noNeedRegularViewInfoForm
);

router.post(
  "/auth-by-provider",
  isNotAuth,
  authByProviderValidation,
  userController.authByProvider
);

module.exports = router;
