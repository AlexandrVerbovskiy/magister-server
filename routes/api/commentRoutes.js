const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
<<<<<<< HEAD
<<<<<<< HEAD
const TenantCommentController = require("../../controllers/TenantCommentController");
=======
const RenterCommentController = require("../../controllers/RenterCommentController");
>>>>>>> fad5f76 (start)
=======
const RenterCommentController = require("../../controllers/RenterCommentController");
>>>>>>> 45e89f9 (start)
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
<<<<<<< HEAD
<<<<<<< HEAD
  createTenantCommentValidation,
=======
  createRenterCommentValidation,
>>>>>>> fad5f76 (start)
=======
  createRenterCommentValidation,
>>>>>>> 45e89f9 (start)
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
<<<<<<< HEAD
<<<<<<< HEAD
  const tenantCommentController = new TenantCommentController(io);
=======
  const renterCommentController = new RenterCommentController(io);
>>>>>>> fad5f76 (start)
=======
  const renterCommentController = new RenterCommentController(io);
>>>>>>> 45e89f9 (start)

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
<<<<<<< HEAD
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
=======
>>>>>>> 45e89f9 (start)
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
<<<<<<< HEAD
>>>>>>> fad5f76 (start)
=======
>>>>>>> 45e89f9 (start)
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
<<<<<<< HEAD
    "/tenant-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    tenantCommentController.approve
=======
=======
>>>>>>> 45e89f9 (start)
    "/renter-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    renterCommentController.approve
<<<<<<< HEAD
>>>>>>> fad5f76 (start)
=======
>>>>>>> 45e89f9 (start)
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
<<<<<<< HEAD
    "/tenant-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    tenantCommentController.reject
=======
=======
>>>>>>> 45e89f9 (start)
    "/renter-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    renterCommentController.reject
<<<<<<< HEAD
>>>>>>> fad5f76 (start)
=======
>>>>>>> 45e89f9 (start)
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
