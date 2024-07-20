const { Router } = require("express");
const router = Router();
const { OrderController } = require("../../controllers");
const {
  isAuth,
  isVerified,
  isSupport,
  isFileLimit,
} = require("../../middlewares");

const { upload } = require("../../utils");

const {
  idParamValidation,
  idBodyValidation,
  createValidation,
  listValidation,
  approveTenantGotListingValidation,
  paypalOrderPayedValidation,
  finishOrderByOwnerValidation,
  bankTransferUnpaidTransactionValidation,
  extendValidation,
} = require("../../validations/order");
const { validateIdParam } = require("../../validations/base");

module.exports = (io) => {
  const orderController = new OrderController(io);

  router.post("/create", isAuth, createValidation, orderController.create);

  router.post("/extend", isAuth, extendValidation, orderController.extend);

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
    "/reject-booking-with-page-props",
    isAuth,
    idBodyValidation,
    listValidation,
    orderController.rejectBookingWithPageProps
  );

  router.post(
    "/admin-order-list",
    isAuth,
    isSupport,
    listValidation,
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
    upload.single("proof"),
    isFileLimit,
    isAuth,
    isVerified,
    bankTransferUnpaidTransactionValidation,
    orderController.unpaidTransactionByBankTransfer
  );

  router.post(
    "/approve-client-got-listing",
    isAuth,
    approveTenantGotListingValidation,
    orderController.approveTenantGotListing
  );

  router.post(
    "/finished-by-owner",
    isAuth,
    finishOrderByOwnerValidation,
    orderController.finishedByOwner
  );

  router.post(
    "/full-cancel-payed",
    isAuth,
    idBodyValidation,
    orderController.fullCancelPayed
  );

  router.post(
    "/full-cancel-payed-with-page-props",
    isAuth,
    idBodyValidation,
    listValidation,
    orderController.fullCancelPayedWithPageProps
  );

  router.post(
    "/full-cancel",
    isAuth,
    idBodyValidation,
    orderController.fullCancel
  );

  router.post(
    "/full-cancel-with-page-props",
    isAuth,
    idBodyValidation,
    listValidation,
    orderController.fullCancelWithPageProps
  );

  router.get(
    "/invoice-pdf/:id",
    isAuth,
    validateIdParam(),
    orderController.generateInvoicePdf
  );

  return router;
};
