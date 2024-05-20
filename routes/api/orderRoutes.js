const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isVerified,
  authId,
  isSupport,
  isVerifiedAndHasPaypalId,
} = require("../../middlewares");
const {
  idParamValidation,
  idBodyValidation,
  createValidation,
  listValidation,
  approveClientGotListingValidation,
  paypalOrderPayedValidation,
  finishOrderByOwnerValidation,
  creditCardUnpaidTransactionValidation,
} = require("../../validations/order");

router.post(
  "/create",
  isAuth,
  isVerifiedAndHasPaypalId,
  createValidation,
  orderController.create
);

router.get(
  "/get-full-by-id/:id",
  isAuth,
  isVerifiedAndHasPaypalId,
  idParamValidation,
  orderController.getFullById
);

router.post(
  "/accept-booking",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.acceptBooking
);

router.post(
  "/reject-booking",
  isAuth,
  isVerified,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.rejectBooking
);

router.post(
  "/booking-list",
  isAuth,
  isVerifiedAndHasPaypalId,
  listValidation,
  orderController.bookingList
);

router.post(
  "/admin-booking-list",
  isAuth,
  isAdmin,
  listValidation,
  orderController.adminBookingList
);

router.post(
  "/order-list",
  isAuth,
  isVerifiedAndHasPaypalId,
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
  isVerifiedAndHasPaypalId,
  paypalOrderPayedValidation,
  orderController.paypalOrderPayed
);

router.post(
  "/credit-card-unpaid-order-transaction-create",
  isAuth,
  isVerifiedAndHasPaypalId,
  creditCardUnpaidTransactionValidation,
  orderController.createUnpaidTransactionByCreditCard
);

router.post(
  "/approve-client-got-listing",
  isAuth,
  isVerifiedAndHasPaypalId,
  approveClientGotListingValidation,
  orderController.approveClientGotListing
);

router.post(
  "/cancel-by-tenant",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.cancelByTenant
);

router.post(
  "/cancel-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.cancelByOwner
);

router.post(
  "/finished-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  finishOrderByOwnerValidation,
  orderController.finishedByOwner
);

router.post(
  "/accept-cancel-by-tenant",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.acceptCancelByTenant
);

router.post(
  "/accept-cancel-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.acceptCancelByOwner
);

router.post(
  "/full-cancel-payed",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.fullCancelPayed
);

router.post(
  "/full-cancel",
  isAuth,
  isVerifiedAndHasPaypalId,
  idBodyValidation,
  orderController.fullCancel
);

module.exports = router;
