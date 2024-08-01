const { Router } = require("express");
const router = Router();
const { RecipientPaymentController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");
const {
  listValidation,
  adminListValidation,
  completedValidation,
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
    adminListValidation,
    recipientPaymentController.adminList
  );

  router.post(
    "/completed",
    isAuth,
    isAdmin,
    completedValidation,
    recipientPaymentController.markAsCompletedRefund
  );

  return router;
};
