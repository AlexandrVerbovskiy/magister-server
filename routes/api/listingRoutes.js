const { Router } = require("express");
const router = Router();
const { ListingController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  authId,
  isSummaryFileLimit,
} = require("../../middlewares");
const { imageUpload } = require("../../utils");
const {
  deleteValidation,
  listValidation,
  listStatusValidation,
  createByAdminValidation,
  updateByAdminValidation,
  createValidation,
  updateValidation,
  ownerListValidation,
  idBodyValidation,
} = require("../../validations/listing");

module.exports = (io) => {
  const listingController = new ListingController(io);

  router.post("/list", authId, listValidation, listingController.mainList);

  router.post(
    "/owner-list",
    authId,
    ownerListValidation,
    listingController.ownerList
  );

  router.post(
    "/admin-list",
    isAuth,
    isAdmin,
    listStatusValidation,
    listingController.adminList
  );

  router.post(
    "/user-list",
    isAuth,
    listStatusValidation,
    listingController.getCurrentUserList
  );

  router.post(
    "/create",
    isAuth,
    imageUpload.any(),
    isSummaryFileLimit,
    isFileLimit,
    createValidation,
    listingController.create
  );

  router.post(
    "/update",
    isAuth,
    imageUpload.any(),
    isSummaryFileLimit,
    isFileLimit,
    updateValidation,
    listingController.update
  );

  router.post(
    "/create-by-admin",
    isAuth,
    isAdmin,
    imageUpload.any(),
    isSummaryFileLimit,
    isFileLimit,
    createByAdminValidation,
    listingController.createByAdmin
  );

  router.post(
    "/update-by-admin",
    isAuth,
    isAdmin,
    imageUpload.any(),
    isSummaryFileLimit,
    isFileLimit,
    updateByAdminValidation,
    listingController.updateByAdmin
  );

  router.post(
    "/delete-by-admin",
    isAuth,
    isAdmin,
    deleteValidation,
    listingController.deleteByAdmin
  );

  router.post(
    "/change-active",
    isAuth,
    idBodyValidation,
    listingController.changeActive
  );

  router.post(
    "/change-active-by-admin",
    isAuth,
    isAdmin,
    idBodyValidation,
    listingController.changeActiveByAdmin
  );

  router.post("/change-favorite", isAuth, listingController.changeFavorite);

  return router;
};
