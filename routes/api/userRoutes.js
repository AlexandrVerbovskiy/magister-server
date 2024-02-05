const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const STATIC = require("../../static");

const { userController } = require("../../controllers");
const { setRoleValidation, requiredId, linkRequiredId } = require("../../validations/users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(STATIC.MAIN_DIRECTORY, "uploads");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
});

const upload = multer({ storage: storage });

router.post("/list", userController.list);
router.get("/get-by-id/:id", linkRequiredId, userController.getById);
router.post("/set-role", setRoleValidation, userController.setRole);
router.post("/delete", requiredId, userController.delete);
router.post("/change-active", requiredId, userController.changeActive);
router.post("/update", upload.single("photo"), userController.update);

module.exports = router;
