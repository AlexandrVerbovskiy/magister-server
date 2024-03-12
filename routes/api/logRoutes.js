const { Router } = require("express");
const router = Router();
const { logController } = require("../../controllers");
const { idValidation, listValidation } = require("../../validations/log");

router.post("/list", listValidation, logController.list);
router.get("/get-by-id/:id", idValidation, logController.getById);

module.exports = router;
