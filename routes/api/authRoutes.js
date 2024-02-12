const { Router } = require("express");
const router = Router();
const { isAuth, isNotAuth, isFileLimit } = require("../../middlewares");
const {
  userController,
  userVerifyRequestController,
} = require("../../controllers");
const {
  registerValidation,
  loginValidation,
  updateShortInfoValidation,
  updatePasswordValidation,
  twoFactorAuthGenerateValidation,
  twoFactorAuthVerifyValidation,
  verifyEmailValidation,
  resetPasswordValidation,
  codeValidation,
} = require("../../validations/auth");
const { upload } = require("../../utils");

const emailValidation = require("../../validations/auth/emailValidation");

router.post(
  "/register",
  isNotAuth,
  registerValidation,
  userController.register
);

router.post("/login", isNotAuth, loginValidation, userController.login);

router.get("/test", userController.test);
router.post("/my-info", isAuth, userController.myInfo);
router.post("/my-documents", isAuth, userController.myDocuments);
router.post(
  "/save-profile",
  upload.single("photo"),
  isAuth,
  isFileLimit,
  userController.saveProfile
);

router.post(
  "/update-short-info",
  isAuth,
  updateShortInfoValidation,
  userController.updateShortInfo
);

router.post(
  "/update-my-password",
  isAuth,
  updatePasswordValidation,
  userController.updateMyPassword
);

router.post(
  "/save-my-documents",
  upload.any(),
  isAuth,
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
  userController.twoFactorAuthGenerate
);
router.post(
  "/check-two-factor-code",
  isNotAuth,
  userController.twoFactorAuthVerify
);

router.post(
  "/change-two-factor-auth",
  isAuth,
  userController.changeTwoFactorAuth
);

router.post(
  "/can-send-verify-request",
  isAuth,
  userVerifyRequestController.checkUserCanVerifyRequest
);

module.exports = router;