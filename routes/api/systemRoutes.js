const { Router } = require("express");
const router = Router();
const { systemController } = require("../../controllers");
const { setOptionsValidation } = require("../../validations/system");

router.get("/get-system-options", systemController.getSystemOptions);
router.post(
  "/set-system-options",
  setOptionsValidation,
  systemController.setSystemOptions
);

module.exports = router;
