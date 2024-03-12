const { Router } = require("express");
const router = Router();
const { systemController } = require("../../controllers");
const {setUserLogActiveValidation} = require("../../validations/system");

router.get("/get-user-log-active", systemController.getUserLogActive);
router.post(
  "/set-user-log-active",
  setUserLogActiveValidation,
  systemController.setUserLogActive
);

module.exports = router;
