const { Router } = require("express");
const router = Router();
const { listingCommentController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");
const tenantCommentController = require("../../controllers/tenantCommentController");
const ownerCommentController = require("../../controllers/ownerCommentController");

router.post(
  "/listing-list",
  isAuth,
  isSupport,
  listingCommentController.commentList
);

router.post(
  "/tenant-list",
  isAuth,
  isSupport,
  tenantCommentController.commentList
);

router.post(
  "/owner-list",
  isAuth,
  isSupport,
  ownerCommentController.commentList
);

router.post(
  "/listing-approve",
  isAuth,
  isSupport,
  listingCommentController.approve
);

router.post(
  "/tenant-approve",
  isAuth,
  isSupport,
  tenantCommentController.approve
);

router.post("/owner-approve", isAuth, isSupport, ownerCommentController.approve);

router.post(
  "/listing-reject",
  isAuth,
  isSupport,
  listingCommentController.reject
);

router.post("/tenant-reject", isAuth, isSupport, tenantCommentController.reject);

router.post("/owner-reject", isAuth, isSupport, ownerCommentController.reject);

module.exports = router;
