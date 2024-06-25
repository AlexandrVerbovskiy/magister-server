const { Router } = require("express");
const router = Router();
const { ListingCommentController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");
const TenantCommentController = require("../../controllers/TenantCommentController");
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const { commentListValidation } = require("../../validations/comments");
const commentRejectValidation = require("../../validations/comments/commentRejectValidation");
const commentApproveValidation = require("../../validations/comments/commentApproveValidation");

module.exports = (io) => {
  const listingCommentController = new ListingCommentController(io);
  const ownerCommentController = new OwnerCommentController(io);
  const tenantCommentController = new TenantCommentController(io);

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

  return router;
};
