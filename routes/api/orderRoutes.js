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
  isVerified,
  createValidation,
  orderController.create
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
  idBodyValidation,
  orderController.rejectBooking
);

router.post(
  "/booking-list",
  isAuth,
  isVerified,
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
  paypalOrderPayedValidation,
  orderController.paypalOrderPayed
);

router.post(
  "/approve-client-got-listing",
  isAuth,
  approveClientGotListingValidation,
  orderController.approveClientGotListing
);

router.post("/cancel-by-tenant", isAuth, orderController.cancelByTenant);

router.post("/cancel-by-owner", isAuth, orderController.cancelByOwner);

router.post("/accept-cancel-by-tenant", isAuth, orderController.acceptCancelByTenant);

router.post("/accept-cancel-by-owner", isAuth, orderController.acceptCancelByOwner);

router.post("/full-cancel-payed", isAuth, orderController.fullCancelPayed);

router.post("/full-cancel", isAuth, orderController.fullCancel);

module.exports = router;
