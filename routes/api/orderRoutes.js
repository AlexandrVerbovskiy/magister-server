const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
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
  approveClientGotListingValidation,
  paypalOrderPayedValidation,
  finishOrderByOwnerValidation,
  creditCardUnpaidTransactionValidation,
  extendValidation,
} = require("../../validations/order");
const { validateIdParam } = require("../../validations/base");

module.exports = (io) => {
  orderController.bindIo(io);

  router.post(
    "/create",
    isAuth,
    isVerified,
    createValidation,
    orderController.create
  );

  router.post(
    "/extend",
    isAuth,
    isVerified,
    extendValidation,
    orderController.extend
  );

  router.get(
    "/get-full-by-id/:id",
    isAuth,
    isVerified,
    idParamValidation,
    orderController.getFullById
  );

  router.post(
    "/accept-booking",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.acceptBooking
  );

  router.post(
    "/reject-booking",
    isAuth,
    isVerified,
    isVerified,
    idBodyValidation,
    orderController.rejectBooking
  );

  router.post(
    "/order-list",
    isAuth,
    isVerified,
    listValidation,
    orderController.orderList
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
    "/unpaid-order-transaction-credit-card",
    upload.single("proof"),
    isFileLimit,
    isAuth,
    isVerified,
    creditCardUnpaidTransactionValidation,
    orderController.unpaidTransactionByCreditCard
  );

  router.post(
    "/approve-client-got-listing",
    isAuth,
    isVerified,
    approveClientGotListingValidation,
    orderController.approveClientGotListing
  );

  router.post(
    "/cancel-by-tenant",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.cancelByTenant
  );

  router.post(
    "/cancel-by-owner",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.cancelByOwner
  );

  router.post(
    "/finished-by-owner",
    isAuth,
    isVerified,
    finishOrderByOwnerValidation,
    orderController.finishedByOwner
  );

  router.post(
    "/accept-cancel-by-tenant",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.acceptCancelByTenant
  );

  router.post(
    "/accept-cancel-by-owner",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.acceptCancelByOwner
  );

  router.post(
    "/full-cancel-payed",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.fullCancelPayed
  );

  router.post(
    "/full-cancel",
    isAuth,
    isVerified,
    idBodyValidation,
    orderController.fullCancel
  );

  router.get(
    "/invoice-pdf/:id",
    isAuth,
    validateIdParam(),
    orderController.generateInvoicePdf
  );

  return router;
};
