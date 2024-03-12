const { Router } = require("express");
const router = Router();
const { listingApprovalRequestController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");
const {
  listValidation,
  idValidation,
  rejectValidation,
} = require("../../validations/listingApprovalRequest");

router.post("/list", listValidation, listingApprovalRequestController.list);

router.post(
  "/admin-list",
  isAuth,
  isAdmin,
  listValidation,
  listingApprovalRequestController.adminList
);

router.post(
  "/create",
  isAuth,
  idValidation,
  listingApprovalRequestController.create
);

router.post(
  "/approve",
  isAuth,
  isAdmin,
  idValidation,
  listingApprovalRequestController.approve
);

router.post(
  "/reject",
  isAuth,
  isAdmin,
  rejectValidation,
  listingApprovalRequestController.reject
);

module.exports = router;
