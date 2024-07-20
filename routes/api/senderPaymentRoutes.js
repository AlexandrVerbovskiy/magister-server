const { Router } = require("express");
const router = Router();
const { SenderPaymentController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
} = require("../../middlewares");

const { upload } = require("../../utils");

const {
  paypalCreateOrderValidation,
  listValidation,
  approveCreditCardTransactionValidation,
  rejectCreditCardTransactionValidation,
} = require("../../validations/senderPayment");

const { validateIdParam } = require("../../validations/base");

module.exports = (io) => {
  const senderPaymentController = new SenderPaymentController(io);

  router.post(
    "/paypal-create-order",
    isAuth,
    paypalCreateOrderValidation,
    senderPaymentController.paypalCreateOrder
  );

  router.post(
    "/list",
    isAuth,
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

  router.post(
    "/approve-bank-transfer-transaction",
    isAuth,
    isAdmin,
    approveCreditCardTransactionValidation,
    senderPaymentController.approveTransaction
  );

  router.post(
    "/reject-bank-transfer-transaction",
    isAuth,
    isAdmin,
    rejectCreditCardTransactionValidation,
    senderPaymentController.rejectTransaction
  );

  return router;
};
