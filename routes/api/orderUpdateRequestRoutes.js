const { Router } = require("express");
const router = Router();
const { OrderUpdateRequestController } = require("../../controllers");
const { isAuth, isVerified } = require("../../middlewares");
const { createValidation } = require("../../validations/orderUpdateRequest");

module.exports = (io) => {
  const orderUpdateRequestController = new OrderUpdateRequestController(io);

  router.post(
    "/create",
    isAuth,
    isVerified,
    createValidation,
    orderUpdateRequestController.create
  );

  return router;
};
