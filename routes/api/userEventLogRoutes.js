const { Router } = require("express");
const router = Router();
const { userEventLogController } = require("../../controllers");
const { listValidation } = require("../../validations/userEventLog");

module.exports = (io) => {
  userEventLogController.bindIo(io);
  router.post("/list", listValidation, userEventLogController.list);
  return router;
};
