const { Router } = require("express");
const router = Router();
const { userVerifyRequestController } = require("../../controllers");
const { isAuth, isSupport, isUnverified } = require("../../middlewares");
const { listValidation, idValidation, updateValidation } = require("../../validations/userVerifyRequest");

router.post(
  "/list",
  isAuth,
  isSupport,
  listValidation,
  userVerifyRequestController.list
);

router.get(
  "/get-by-id/:id",
  isAuth,
  isSupport,
  idValidation,
  userVerifyRequestController.getById
);

router.post(
  "/create",
  isAuth,
  isUnverified,
  userVerifyRequestController.createUserVerifyRequest
);

router.post(
  "/update",
  isAuth,
  isSupport,
  updateValidation,
  userVerifyRequestController.updateUserVerifyRequest
);

module.exports = router;
