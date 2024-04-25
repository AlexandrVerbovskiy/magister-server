const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  isVerified,
  authId,
  isSupport
} = require("../../middlewares");
const {
  idParamValidation,
  idBodyValidation,
  createValidation,
  listValidation,
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

module.exports = router;
