const { Router } = require("express");
const router = Router();
const { userController } = require("../controllers");

router.post("/list", userController.list);
router.post("/set-role", userController.setRole);
router.post("/delete", userController.delete);
router.post("/change-active", userController.changeActive);

module.exports = router;
