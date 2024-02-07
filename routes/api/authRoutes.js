const { Router } = require("express");
const router = Router();
const { isAuth, isNotAuth, isFileLimit } = require("../../middlewares");
const { userController } = require("../../controllers");
const {
  registerValidation,
  loginValidation,
  passwordValidation,
  updatePasswordValidation,
  twoFactorAuthGenerateValidation,
  twoFactorAuthVerifyValidation,
  verifyEmailValidation,
  resetPasswordValidation,
} = require("../../validations/auth");
const { upload } = require("../../utils");
const emailValidation = require("../../validations/auth/emailValidation");
const tokenValidation = require("../../validations/auth/tokenValidation");

router.post(
  "/register",
  isNotAuth,
  registerValidation,
  userController.register
);

router.post("/login", isNotAuth, loginValidation, userController.login);

/*router.post(
  "/register-admin",
  isNotAuth,
  registerValidation,
  userController.register
);*/

router.get("/update-session-info", isAuth, userController.updateSessionInfo);
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
  "/set-my-password",
  isAuth,
  passwordValidation,
  userController.setMyPassword
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

module.exports = router;
