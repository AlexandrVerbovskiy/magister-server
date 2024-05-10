const { Router } = require("express");
const router = Router();
const { listingController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isFileLimit,
  isVerified,
  authId,
  isVerifiedAndHasPaypalId,
} = require("../../middlewares");
const { upload } = require("../../utils");
const {
  deleteValidation,
  listValidation,
  listStatusValidation,
  idParamValidation,
  createByAdminValidation,
  updateByAdminValidation,
  createValidation,
  updateValidation,
  ownerListValidation,
  idBodyValidation
} = require("../../validations/listing");

router.post("/list", authId, listValidation, listingController.mainList);

router.post(
  "/owner-list",
  authId,
  isVerifiedAndHasPaypalId,
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
  isVerified,
  listStatusValidation,
  listingController.getCurrentUserList
);

router.get(
  "/get-short-by-id/:id",
  idParamValidation,
  listingController.getShortById
);
router.get(
  "/get-full-by-id/:id",
  idParamValidation,
  listingController.getFullById
);

router.post(
  "/create",
  isAuth,
  isVerified,
  isVerifiedAndHasPaypalId,
  upload.any(),
  isFileLimit,
  createValidation,
  listingController.create
);

router.post(
  "/update",
  isAuth,
  isVerified,
  upload.any(),
  isFileLimit,
  updateValidation,
  listingController.update
);

router.post(
  "/create-by-admin",
  isAuth,
  isAdmin,
  upload.any(),
  isFileLimit,
  createByAdminValidation,
  listingController.createByAdmin
);

router.post(
  "/update-by-admin",
  isAuth,
  isAdmin,
  upload.any(),
  isFileLimit,
  updateByAdminValidation,
  listingController.updateByAdmin
);

router.post("/delete", isAuth, deleteValidation, listingController.delete);

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

module.exports = router;
