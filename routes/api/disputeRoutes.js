const { Router } = require("express");
const router = Router();
const { DisputeController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");
const {
  adminDisputeListValidation,
  createDisputeValidation,
  solveDisputeValidation,
  unsolveDisputeValidation,
} = require("../../validations/disputes");

module.exports = (io) => {
  const disputeController = new DisputeController(io);

  router.post(
    "/list",
    isAuth,
    isSupport,
    adminDisputeListValidation,
    disputeController.list
  );

  router.post(
    "/create",
    isAuth,
    createDisputeValidation,
    disputeController.create
  );

  router.post(
    "/solve",
    isAuth,
    isSupport,
    solveDisputeValidation,
    disputeController.solve
  );

  router.post(
    "/unsolve",
    isAuth,
    isSupport,
    unsolveDisputeValidation,
    disputeController.unsolve
  );

  return router;
};
