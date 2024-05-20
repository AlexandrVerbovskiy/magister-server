const { Router } = require("express");
const router = Router();
const { senderPaymentController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isVerifiedAndHasPaypalId,
} = require("../../middlewares");
const {
  paypalCreateOrderValidation,
  listValidation,
  approveCreditCardTransactionValidation,
  rejectCreditCardTransactionValidation,
} = require("../../validations/senderPayment");

const { validateIdParam } = require("../../validations/base");

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
  listValidation,
  senderPaymentController.userList
);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  listValidation,
  senderPaymentController.adminList
);

router.get(
  "/invoice-pdf/:id",
  isAuth,
  validateIdParam(),
  senderPaymentController.generateInvoicePdf
);

router.get(
  "/approve-credit-card-transaction",
  isAuth,
  approveCreditCardTransactionValidation,
  senderPaymentController.approveCreditCardTransaction
);

router.get(
  "/reject-credit-card-transaction",
  isAuth,
  rejectCreditCardTransactionValidation,
  senderPaymentController.rejectCreditCardTransaction
);

module.exports = router;
