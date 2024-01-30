const { Router } = require("express");
const router = Router();
const { userController } = require("../controllers");

router.post("/set-role", userController.setRole);
router.post("/change-active", userController.changeActive);

module.exports = router;
