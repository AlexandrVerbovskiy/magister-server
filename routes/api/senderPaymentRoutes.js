const { Router } = require("express");
const router = Router();
const { senderPaymentController } = require("../../controllers");
const { isAuth, isAdmin, isVerifiedAndHasPaypalId } = require("../../middlewares");
const {
  paypalCreateOrderValidation,
} = require("../../validations/senderPayment");

router.post(
  "/paypal-create-order",
  isAuth,
  paypalCreateOrderValidation,
  senderPaymentController.paypalCreateOrder
);

router.post(
  "/list",
  isAuth,
  isVerifiedAndHasPaypalId,
  senderPaymentController.userList
);

router.post("/admin-list", isAuth, isAdmin, senderPaymentController.adminList);

router.get(
  "/invoice-pdf/:id",
  isAuth,
  senderPaymentController.generateInvoicePdf
);

module.exports = router;
