const { Router } = require("express");
const router = Router();
const { DisputePredictionModelController } = require("../../controllers");

module.exports = (io) => {
  const disputePredictionModelController = new DisputePredictionModelController(
    io
  );

  router.post("/stop", disputePredictionModelController.stop);
  router.post("/unstop", disputePredictionModelController.unstop);

  router.post("/set-active", disputePredictionModelController.setActive);
  router.post("/start-training", disputePredictionModelController.startTraining)
  router.post("/create", disputePredictionModelController.create);
  router.post("/update", disputePredictionModelController.update);
  router.post("/list", disputePredictionModelController.list);

  return router;
};
