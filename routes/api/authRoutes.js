const { Router } = require("express");
const router = Router();
const { isAuth, isNotAuth, isFileLimit } = require("../../middlewares");
const { userController } = require("../../controllers");
const {
  registerValidation,
  loginValidation,
  passwordValidation,
  updatePasswordValidation,
} = require("../../validations/auth");
const { upload } = require("../../utils");

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

router.post(
  "/reset-password",
  isNotAuth,
  registerValidation,
  userController.resetPassword
);

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

module.exports = router;
