const { Router } = require("express");
const router = Router();
const { orderUpdateRequestController } = require("../../controllers");
const {
  isAuth,
  isVerified,
} = require("../../middlewares");
const {createValidation} = require("../../validations/orderUpdateRequest");

router.post(
  "/create",
  isAuth,
  isVerified,
  createValidation,
  orderUpdateRequestController.create
);

module.exports = router;
