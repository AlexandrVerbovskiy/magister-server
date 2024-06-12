const { Router } = require("express");
const router = Router();
const { listingCommentController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");
const tenantCommentController = require("../../controllers/tenantCommentController");
const ownerCommentController = require("../../controllers/ownerCommentController");
const { commentListValidation } = require("../../validations/comments");
const commentRejectValidation = require("../../validations/comments/commentRejectValidation");
const commentApproveValidation = require("../../validations/comments/commentApproveValidation");

router.post(
  "/listing-list",
  isAuth,
  isSupport,
  commentListValidation,
  listingCommentController.commentList
);

router.post(
  "/tenant-list",
  isAuth,
  isSupport,
  commentListValidation,
  tenantCommentController.commentList
);

router.post(
  "/owner-list",
  isAuth,
  isSupport,
  commentListValidation,
  ownerCommentController.commentList
);

router.post(
  "/listing-approve",
  isAuth,
  isSupport,
  commentApproveValidation,
  listingCommentController.approve
);

router.post(
  "/tenant-approve",
  isAuth,
  isSupport,
  commentApproveValidation,
  tenantCommentController.approve
);

router.post(
  "/owner-approve",
  isAuth,
  isSupport,
  commentApproveValidation,
  ownerCommentController.approve
);

router.post(
  "/listing-reject",
  isAuth,
  isSupport,
  commentRejectValidation,
  listingCommentController.reject
);

router.post(
  "/tenant-reject",
  isAuth,
  isSupport,
  commentRejectValidation,
  tenantCommentController.reject
);

router.post(
  "/owner-reject",
  isAuth,
  isSupport,
  commentRejectValidation,
  ownerCommentController.reject
);

module.exports = router;
