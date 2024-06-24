const { Router } = require("express");
const router = Router();
const { logController } = require("../../controllers");
const { idValidation, listValidation } = require("../../validations/log");

module.exports = (io) => {
  logController.bindIo(io);
  router.post("/list", listValidation, logController.list);
  router.get("/get-by-id/:id", idValidation, logController.getById);
  return router;
};
