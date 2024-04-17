const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  isVerified,
  authId,
} = require("../../middlewares");
const {
  idParamValidation,
  createValidation,
} = require("../../validations/order");

router.post(
  "/create",
  isAuth,
  isVerified,
  createValidation,
  orderController.create
);

router.get(
  "/get-full-by-id/:id",
  isAuth,
  isVerified,
  idParamValidation,
  orderController.getFullById
);

module.exports = router;
