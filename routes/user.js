const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const STATIC = require("../static");

const { userController } = require("../controllers");
const {
  setRoleValidation,
  changeActiveValidation,
  deleteValidation,
} = require("../validations/users");

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

router.post("/list", jsonParser, userController.list);
router.get("/get-by-id/:id", jsonParser, userController.getById);
router.post("/set-role", jsonParser, setRoleValidation, userController.setRole);
router.post("/delete", jsonParser, deleteValidation, userController.delete);
router.post(
  "/change-active",
  jsonParser,
  changeActiveValidation,
  userController.changeActive
);
router.post("/update", upload.single("photo"), userController.update);

module.exports = router;
