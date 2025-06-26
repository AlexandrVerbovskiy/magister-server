const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
<<<<<<< HEAD
const TenantCommentController = require("../../controllers/TenantCommentController");
=======
const RenterCommentController = require("../../controllers/RenterCommentController");
>>>>>>> fad5f76 (start)
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
<<<<<<< HEAD
  createTenantCommentValidation,
=======
  createRenterCommentValidation,
>>>>>>> fad5f76 (start)
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
<<<<<<< HEAD
  const tenantCommentController = new TenantCommentController(io);
=======
  const renterCommentController = new RenterCommentController(io);
>>>>>>> fad5f76 (start)

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
<<<<<<< HEAD
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
=======
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
>>>>>>> fad5f76 (start)
  );

  router.post(
    "/owner-list",
    isAuth,
    isSupport,
    commentListValidation,
    ownerCommentController.commentList
  );

  router.post(
<<<<<<< HEAD
    "/tenant-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    tenantCommentController.approve
=======
    "/renter-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    renterCommentController.approve
>>>>>>> fad5f76 (start)
  );

  router.post(
    "/owner-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    ownerCommentController.approve
  );

  router.post(
<<<<<<< HEAD
    "/tenant-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    tenantCommentController.reject
=======
    "/renter-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    renterCommentController.reject
>>>>>>> fad5f76 (start)
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
