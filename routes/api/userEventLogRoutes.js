const { Router } = require("express");
const router = Router();
const { userEventLogController } = require("../../controllers");

router.post("/list", userEventLogController.list);

module.exports = router;