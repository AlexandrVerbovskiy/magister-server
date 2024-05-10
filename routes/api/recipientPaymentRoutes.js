const { Router } = require("express");
const router = Router();
const { recipientPaymentController } = require("../../controllers");
const { isAuth, isAdmin, isVerifiedAndHasPaypalId } = require("../../middlewares");

router.post(
  "/list",
  isAuth,
  isVerifiedAndHasPaypalId,
  recipientPaymentController.userList
);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  recipientPaymentController.adminList
);

module.exports = router;
