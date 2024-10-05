const { Router } = require("express");
const router = Router();
const { isAuth, isSupport } = require("../../middlewares");
const WorkerCommentController = require("../../controllers/WorkerCommentController");
const OwnerCommentController = require("../../controllers/OwnerCommentController");
const {
  commentListValidation,
  createOwnerCommentValidation,
  createWorkerCommentValidation,
  commentRejectValidation,
  commentApproveValidation,
} = require("../../validations/comments");

module.exports = (io) => {
  const ownerCommentController = new OwnerCommentController(io);
  const workerCommentController = new WorkerCommentController(io);

  router.post(
    "/create-owner-review",
    isAuth,
    createOwnerCommentValidation,
    ownerCommentController.createComment
  );

  router.post(
    "/create-worker-review",
    isAuth,
    createWorkerCommentValidation,
    workerCommentController.createComment
  );

  router.post(
    "/worker-list",
    isAuth,
    isSupport,
    commentListValidation,
    workerCommentController.commentList
  );

  router.post(
    "/owner-list",
    isAuth,
    isSupport,
    commentListValidation,
    ownerCommentController.commentList
  );

  router.post(
    "/worker-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    workerCommentController.approve
  );

  router.post(
    "/owner-approve",
    isAuth,
    isSupport,
    commentApproveValidation,
    ownerCommentController.approve
  );

  router.post(
    "/worker-reject",
    isAuth,
    isSupport,
    commentRejectValidation,
    workerCommentController.reject
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
