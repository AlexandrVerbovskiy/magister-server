const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
const TenantCommentController = require("../../controllers/TenantCommentController");
=======
const RenterCommentController = require("../../controllers/RenterCommentController");
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
const WorkerCommentController = require("../../controllers/WorkerCommentController");
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
  createTenantCommentValidation,
=======
  createRenterCommentValidation,
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
  createWorkerCommentValidation,
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
  const tenantCommentController = new TenantCommentController(io);
=======
  const renterCommentController = new RenterCommentController(io);
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
  const workerCommentController = new WorkerCommentController(io);
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
    "/create-tenant-review",
=======
    "/create-worker-review",
>>>>>>> e08e27f (total rotation)
    isAuth,
    createWorkerCommentValidation,
    workerCommentController.createComment
  );

  router.post(
    "/worker-list",
    isAuth,
    isSupport,
    commentListValidation,
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
    workerCommentController.commentList
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
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
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
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
<<<<<<< HEAD
=======
    "/worker-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    workerCommentController.approve
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
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
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
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
<<<<<<< HEAD
=======
    "/worker-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    workerCommentController.reject
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
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
