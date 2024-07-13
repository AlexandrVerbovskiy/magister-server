const { Router } = require("express");
const router = Router();
const { OrderUpdateRequestController } = require("../../controllers");
const { isAuth } = require("../../middlewares");
const { createValidation } = require("../../validations/orderUpdateRequest");

module.exports = (io) => {
  const orderUpdateRequestController = new OrderUpdateRequestController(io);

  router.post(
    "/create",
    isAuth,
    createValidation,
    orderUpdateRequestController.create
  );

  return router;
};
