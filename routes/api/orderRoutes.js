const { Router } = require("express");
const router = Router();
const { OrderController } = require("../../controllers");
const {
  isAuth,
  isVerified,
  isSupport,
  isFileLimit,
  isSummaryFileLimit,
} = require("../../middlewares");

const { imageUpload } = require("../../utils");

const {
  idParamValidation,
  idBodyValidation,
  createValidation,
  listValidation,
  paypalOrderPayedValidation,
  bankTransferUnpaidTransactionValidation,
  listValidationWithTimeProps,
} = require("../../validations/order");

const { validateIdParam } = require("../../validations/base");

module.exports = (io) => {
  const orderController = new OrderController(io);

  router.post("/create", isAuth, createValidation, orderController.create);

  router.get(
    "/get-full-by-id/:id",
    isAuth,
    idParamValidation,
    orderController.getFullById
  );

  router.post("/order-list", isAuth, listValidation, orderController.orderList);

  router.post(
    "/accept-booking",
    isAuth,
    idBodyValidation,
    orderController.acceptBooking
  );

  router.post(
    "/reject-booking",
    isAuth,
    idBodyValidation,
    orderController.rejectBooking
  );

  router.post(
    "/admin-order-list",
    isAuth,
    isSupport,
    listValidationWithTimeProps,
    orderController.adminOrderList
  );

  router.post(
    "/delete",
    isAuth,
    isSupport,
    idBodyValidation,
    orderController.delete
  );

  router.post(
    "/paypal-order-payed",
    isAuth,
    isVerified,
    paypalOrderPayedValidation,
    orderController.paypalOrderPayed
  );

  router.post(
    "/unpaid-order-transaction-bank-transfer",
    imageUpload.single("proof"),
    isFileLimit,
    isAuth,
    isVerified,
    bankTransferUnpaidTransactionValidation,
    orderController.unpaidTransactionByBankTransfer
  );

  router.post(
    "/full-cancel-payed",
    isAuth,
    idBodyValidation,
    orderController.fullCancelPayed
  );

  router.post(
    "/full-cancel",
    isAuth,
    idBodyValidation,
    orderController.fullCancel
  );

  router.post(
    "/finish",
    isAuth,
    idBodyValidation,
    orderController.finish
  );

  router.post(
    "/accept-finish",
    isAuth,
    idBodyValidation,
    orderController.acceptFinish
  );

  router.get(
    "/invoice-pdf/:id",
    isAuth,
    validateIdParam(),
    orderController.generateInvoicePdf
  );

  return router;
};
