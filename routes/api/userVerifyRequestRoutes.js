const { Router } = require("express");
const router = Router();
const { userVerifyRequestController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");

router.post("/list", isAuth, isSupport, userVerifyRequestController.list);

router.get(
  "/get-by-id/:id",
  isAuth,
  isSupport,
  userVerifyRequestController.getById
);

router.post(
  "/create",
  isAuth,
  userVerifyRequestController.createUserVerifyRequest
);

router.post(
  "/update",
  isAuth,
  isSupport,
  userVerifyRequestController.updateUserVerifyRequest
);

module.exports = router;
