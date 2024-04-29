const { Router } = require("express");
const router = Router();
const { paymentController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  isVerified,
  authId,
} = require("../../middlewares");
const { createPaymentIntentValidation } = require("../../validations/payment");

router.post(
  "/create-payment-intent",
  isAuth,
  isVerified,
  createPaymentIntentValidation,
  paymentController.createPaymentIntent
);

router.post("/generate-qrcode", paymentController.generateQrCode);

router.post("/test", paymentController.test);

module.exports = router;
