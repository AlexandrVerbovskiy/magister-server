const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
const TenantCommentController = require("../../controllers/TenantCommentController");
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
  createTenantCommentValidation,
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
  const tenantCommentController = new TenantCommentController(io);

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
    "/create-tenant-review",
    isAuth,
    createTenantCommentValidation,
    tenantCommentController.createComment
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
