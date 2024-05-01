const { Router } = require("express");
const router = Router();
const { senderPaymentController } = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {
  paypalCreateOrderValidation,
  paypalOrderPayedValidation,
} = require("../../validations/senderPayment");

router.post(
  "/paypal-create-order",
  isAuth,
  paypalCreateOrderValidation,
  senderPaymentController.paypalCreateOrder
);

router.post(
  "/paypal-order-payed",
  isAuth,
  paypalOrderPayedValidation,
  senderPaymentController.paypalOrderPayed
);

module.exports = router;
