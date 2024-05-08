const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
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
  orderController.cancelByTenant
);

router.post(
  "/cancel-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.cancelByOwner
);

router.post(
  "/finished-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.finishedByOwner
);

router.post(
  "/accept-cancel-by-tenant",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.acceptCancelByTenant
);

router.post(
  "/accept-cancel-by-owner",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.acceptCancelByOwner
);

router.post(
  "/full-cancel-payed",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.fullCancelPayed
);

router.post(
  "/full-cancel",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderController.fullCancel
);

module.exports = router;
