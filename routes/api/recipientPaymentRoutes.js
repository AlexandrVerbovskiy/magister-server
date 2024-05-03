const { Router } = require("express");
const router = Router();
const { recipientPaymentController } = require("../../controllers");
const { isAuth } = require("../../middlewares");
const isAdmin = require("../../middlewares/isAdmin");

router.post("/list", isAuth, recipientPaymentController.userList);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  recipientPaymentController.adminList
);

module.exports = router;
