const { Router } = require("express");
const router = Router();
const { systemController } = require("../../controllers");

router.get("/get-user-log-active", systemController.getUserLogActive);
router.post("/set-user-log-active", systemController.setUserLogActive);

module.exports = router;
