const { Router } = require("express");
const router = Router();
const { RecipientPaymentController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");
const {
  listValidation,
  waitingRefundsListValidation,
} = require("../../validations/recipientPayment");

module.exports = (io) => {
  const recipientPaymentController = new RecipientPaymentController(io);

  router.post(
    "/list",
    isAuth,
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

  router.post(
    "/update-failed",
    isAuth,
    recipientPaymentController.updateFailed
  );

  router.post(
    "/failed-recipient-mark-done",
    isAuth,
    recipientPaymentController.markFailedRecipientDone
  );

  return router;
};
