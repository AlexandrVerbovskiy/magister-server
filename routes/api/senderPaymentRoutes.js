const { Router } = require("express");
const router = Router();
const { senderPaymentController } = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {
  paypalCreateOrderValidation,
  paypalOrderPayedValidation,
} = require("../../validations/senderPayment");
const isAdmin = require("../../middlewares/isAdmin");

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

router.post("/list", isAuth, senderPaymentController.userList);

router.post("/admin-list", isAuth, isAdmin, senderPaymentController.adminList);

module.exports = router;
