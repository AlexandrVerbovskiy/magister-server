const { Router } = require("express");
const router = Router();
const { logController } = require("../../controllers");

router.post("/list", logController.list);
router.get("/get-by-id/:id", logController.getById);

module.exports = router;
