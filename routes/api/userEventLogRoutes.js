const { Router } = require("express");
const router = Router();
const { UserEventLogController } = require("../../controllers");
const { listValidation } = require("../../validations/userEventLog");

module.exports = (io) => {
  const userEventLogController = new UserEventLogController(io);  
  router.post("/list", listValidation, userEventLogController.list);
  return router;
};
