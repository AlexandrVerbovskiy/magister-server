const { Router } = require("express");
const router = Router();
const { listingApprovalRequestController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.post("/list", listingApprovalRequestController.list);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  listingApprovalRequestController.adminList
);

router.post("/create", isAuth, listingApprovalRequestController.create);

router.post(
  "/approve",
  isAuth,
  isAdmin,
  listingApprovalRequestController.approve
);

router.post("/reject", isAuth, isAdmin, listingApprovalRequestController.reject);

module.exports = router;
