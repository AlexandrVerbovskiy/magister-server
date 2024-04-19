const { Router } = require("express");
const router = Router();
const { orderController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  isVerified,
  authId,
} = require("../../middlewares");
const {
  idParamValidation,
  idBodyValidation,
  createValidation,
  listValidation
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
  "/order-list",
  isAuth,
  isVerified,
  listValidation,
  orderController.orderList
);

module.exports = router;
