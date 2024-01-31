const { Router } = require("express");
const router = Router();
const { isAuth, isNotAuth } = require("../middlewares");
const { userController } = require("../controllers");
const { registerValidation, loginValidation } = require("../validations");

router.post(
  "/register",
  isNotAuth,
  registerValidation,
  userController.register
);

router.post(
  "/login",
  isNotAuth,
  loginValidation,
  userController.login
);

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

module.exports = router;
