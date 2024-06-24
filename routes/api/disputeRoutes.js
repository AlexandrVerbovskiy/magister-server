const { Router } = require("express");
const router = Router();
const { disputeController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");
const {
  adminDisputeListValidation,
  createDisputeValidation,
  solveDisputeValidation,
  unsolveDisputeValidation,
} = require("../../validations/disputes");

module.exports = (io) => {
  disputeController.bindIo(io);

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
