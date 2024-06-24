const { Router } = require("express");
const router = Router();
const { LogController } = require("../../controllers");
const { idValidation, listValidation } = require("../../validations/log");

module.exports = (io) => {
  const logController = new LogController(io);
  router.post("/list", listValidation, logController.list);
  router.get("/get-by-id/:id", idValidation, logController.getById);
  return router;
};
