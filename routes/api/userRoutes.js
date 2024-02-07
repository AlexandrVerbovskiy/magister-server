const { Router } = require("express");
const router = Router();
const { userController } = require("../../controllers");
const {
  setRoleValidation,
  idValidation,
  linkValidation,
} = require("../../validations/users");
const { upload } = require("../../utils");
const { isFileLimit } = require("../../middlewares");

router.post("/list", userController.list);
router.get("/get-by-id/:id", linkValidation, userController.getById);
router.post("/set-role", setRoleValidation, userController.setRole);
router.post("/delete", idValidation, userController.delete);
router.post("/change-active", idValidation, userController.changeActive);
router.post(
  "/update",
  upload.single("photo"),
  isFileLimit,
  userController.update
);
router.post("/documents", userController.getDocumentsByUserId);

module.exports = router;
