const { Router } = require("express");
const router = Router();
const { senderPaymentController } = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {
  paypalCreateOrderValidation,
} = require("../../validations/senderPayment");
const isAdmin = require("../../middlewares/isAdmin");

router.post(
  "/paypal-create-order",
  isAuth,
  paypalCreateOrderValidation,
  senderPaymentController.paypalCreateOrder
);

router.post("/list", isAuth, senderPaymentController.userList);

router.post("/admin-list", isAuth, isAdmin, senderPaymentController.adminList);

router.get(
  "/invoice-pdf/:id",
  isAuth,
  senderPaymentController.generateInvoicePdf
);

module.exports = router;
