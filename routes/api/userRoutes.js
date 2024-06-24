const { Router } = require("express");
const router = Router();
const { UserController } = require("../../controllers");
const {
  setRoleValidation,
  idBodyValidation,
  idParamValidation,
  updateValidation,
  createValidation,
  listValidation,
} = require("../../validations/user");
const { upload } = require("../../utils");
const { isFileLimit } = require("../../middlewares");
const { isAuth, isSupport, isAdmin } = require("../../middlewares");

module.exports = (io) => {
  const userController = new UserController(io);

  router.post("/list", isAuth, isSupport, listValidation, userController.list);

  router.get("/get-by-id/:id", idParamValidation, userController.getById);

  router.get(
    "/get-full-by-id/:id",
    isAuth,
    isSupport,
    idParamValidation,
    userController.getFullById
  );

  router.post(
    "/set-role",
    isAuth,
    isAdmin,
    setRoleValidation,
    userController.setRole
  );

  router.post(
    "/delete",
    isAuth,
    isAdmin,
    idBodyValidation,
    userController.delete
  );

  router.post(
    "/change-active",
    isAuth,
    isAdmin,
    idBodyValidation,
    userController.changeActive
  );
  router.post(
    "/change-verified",
    isAuth,
    isSupport,
    idBodyValidation,
    userController.changeVerified
  );

  router.post(
    "/update",
    isAuth,
    isAdmin,
    upload.single("photo"),
    isFileLimit,
    updateValidation,
    userController.update
  );

  router.post(
    "/create",
    isAuth,
    isAdmin,
    upload.single("photo"),
    isFileLimit,
    createValidation,
    userController.create
  );

  router.post(
    "/documents",
    isAuth,
    isSupport,
    idBodyValidation,
    userController.getDocumentsByUserId
  );

  return router;
};
