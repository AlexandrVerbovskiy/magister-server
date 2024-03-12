const { Router } = require("express");
const router = Router();
const { userEventLogController } = require("../../controllers");
const { listValidation } = require("../../validations/userEventLog");

router.post("/list", listValidation, userEventLogController.list);

module.exports = router;