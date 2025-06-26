const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
const RenterCommentController = require("../../controllers/RenterCommentController");
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
  createRenterCommentValidation,
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
  const renterCommentController = new RenterCommentController(io);

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
    "/create-renter-review",
    isAuth,
    createRenterCommentValidation,
    renterCommentController.createComment
  );

  router.post(
    "/renter-list",
    isAuth,
    isSupport,
    commentListValidation,
    renterCommentController.commentList
  );

  router.post(
    "/owner-list",
    isAuth,
    isSupport,
    commentListValidation,
    ownerCommentController.commentList
  );

  router.post(
    "/renter-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    renterCommentController.approve
  );

  router.post(
    "/owner-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    ownerCommentController.approve
  );

  router.post(
    "/renter-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    renterCommentController.reject
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
