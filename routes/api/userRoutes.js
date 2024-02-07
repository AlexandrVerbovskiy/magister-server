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
const { isAuth, isSupport, isAdmin } = require("../../middlewares");

router.post("/list", isAuth, isSupport, userController.list);

router.get("/get-by-id/:id", linkValidation, userController.getById);

router.get(
  "/get-full-by-id/:id",
  isAuth,
  isSupport,
  linkValidation,
  userController.getFullById
);

router.post(
  "/set-role",
  isAuth,
  isAdmin,
  setRoleValidation,
  userController.setRole
);

router.post("/delete", isAuth, isAdmin, idValidation, userController.delete);

router.post(
  "/change-active",
  isAuth,
  isAdmin,
  idValidation,
  userController.changeActive
);
router.post(
  "/change-verified",
  isAuth,
  isSupport,
  idValidation,
  userController.changeVerified
);

router.post(
  "/update",
  isAuth,
  isAdmin,
  upload.single("photo"),
  isFileLimit,
  userController.update
);

router.post("/documents", isAuth, isSupport, userController.getDocumentsByUserId);

module.exports = router;
