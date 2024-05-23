const { Router } = require("express");
const router = Router();
const { recipientPaymentController } = require("../../controllers");
const { isAuth, isAdmin, isVerified } = require("../../middlewares");
const {
  listValidation,
  waitingRefundsListValidation,
} = require("../../validations/recipientPayment");

router.post(
  "/list",
  isAuth,
  isVerified,
  listValidation,
  recipientPaymentController.userList
);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  listValidation,
  recipientPaymentController.adminList
);

router.post(
  "/get-waiting-refunds-list",
  isAuth,
  isAdmin,
  waitingRefundsListValidation,
  recipientPaymentController.waitingRefundsList
);

router.post(
  "/completed",
  isAuth,
  isAdmin,
  recipientPaymentController.markAsCompletedRefund
);

router.post(
  "/rejected",
  isAuth,
  isAdmin,
  recipientPaymentController.markAsFailedRefund
);

router.post("/update-failed", isAuth, recipientPaymentController.updateFailed);

router.post(
  "/failed-recipient-mark-done",
  isAuth,
  recipientPaymentController.markFailedRecipientDone
);

module.exports = router;
