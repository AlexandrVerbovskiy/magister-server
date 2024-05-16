const { Router } = require("express");
const router = Router();
const { recipientPaymentController } = require("../../controllers");
const { isAuth, isAdmin, isVerifiedAndHasPaypalId } = require("../../middlewares");
const { listValidation } = require("../../validations/recipientPayment");

router.post(
  "/list",
  isAuth,
  isVerifiedAndHasPaypalId,
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

module.exports = router;
