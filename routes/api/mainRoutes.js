const { Router } = require("express");
const router = Router();
const { mainController } = require("../../controllers");
const { isAuth, isVerified, isAdmin, authId } = require("../../middlewares");
const {
  updateListingOptionsValidation,
  adminUpdateListingOptionsValidation,
  adminUserListOptionsValidation,
  adminLogListOptionsValidation,
  adminUserEventLogListOptionsValidation,
  adminUserVerifyRequestListOptionsValidation,
  adminSearchedWordListOptionsValidation,
  userListingListOptionsValidation,
  adminListingListOptionsValidation,
  listingListOptionsValidation,
  userNameIdListValidation,
  adminListingApprovalRequestListOptionsValidation,
  adminListingApprovalRequestOptionsValidation,
  userDocumentsOptionsValidation,
  listingFullByIdOptionsValidation,
} = require("../../validations/main");
const isSupport = require("../../middlewares/isSupport");

router.get("/index-options", mainController.getIndexPageOptions);

router.get(
  "/create-listing-options",
  isAuth,
  isVerified,
  mainController.getCreateListingPageOptions
);

router.get(
  "/update-listing-options/:id",
  isAuth,
  isVerified,
  updateListingOptionsValidation,
  mainController.getUpdateListingPageOptions
);

router.get(
  "/current-user-documents-options",
  isAuth,
  mainController.getCurrentUserDocumentsPageOptions
);

router.get(
  "/admin-create-listing-options",
  isAuth,
  isAdmin,
  mainController.getAdminListingCreatePageOptions
);

router.get(
  "/admin-update-listing-options/:id",
  isAuth,
  isAdmin,
  adminUpdateListingOptionsValidation,
  mainController.getAdminListingEditPageOptions
);

router.post(
  "/admin-user-list-options",
  isAuth,
  isSupport,
  adminUserListOptionsValidation,
  mainController.getAdminUserListPageOptions
);

router.post(
  "/admin-log-list-options",
  isAuth,
  isAdmin,
  adminLogListOptionsValidation,
  mainController.getAdminLogListPageOptions
);

router.post(
  "/admin-user-event-log-list-options",
  isAuth,
  isAdmin,
  adminUserEventLogListOptionsValidation,
  mainController.getAdminUserEventLogListPageOptions
);

router.post(
  "/admin-user-verify-request-list-options",
  isAuth,
  isSupport,
  adminUserVerifyRequestListOptionsValidation,
  mainController.getAdminUserUserVerifyRequestListPageOptions
);

router.post(
  "/admin-searched-word-list-options",
  isAuth,
  isAdmin,
  adminSearchedWordListOptionsValidation,
  mainController.getAdminSearchedWordListPageOptions
);

router.post(
  "/listing-list-options",
  authId,
  listingListOptionsValidation,
  mainController.getMainListingListPageOptions
);

router.get(
  "/listing-full-by-id-options/:id",
  listingFullByIdOptionsValidation,
  mainController.getListingFullByIdOptions
);

router.post(
  "/user-listing-list-options",
  isAuth,
  isVerified,
  userListingListOptionsValidation,
  mainController.getUserListingListPageOptions
);

router.post(
  "/admin-listing-list-options",
  isAuth,
  isAdmin,
  adminListingListOptionsValidation,
  mainController.getAdminListingListPageOptions
);

router.post(
  "/user-name-id-list",
  userNameIdListValidation,
  mainController.userNameIdList
);

router.post(
  "/admin-listing-approval-request-list-options",
  isAuth,
  isAdmin,
  adminListingApprovalRequestListOptionsValidation,
  mainController.getAdminListingApprovalRequestListPageOptions
);

router.get(
  "/admin-listing-approval-request-options/:id",
  isAuth,
  isAdmin,
  adminListingApprovalRequestOptionsValidation,
  mainController.getAdminListingApprovalRequestPageOptions
);

router.get(
  "/user-documents-options/:id",
  userDocumentsOptionsValidation,
  mainController.getUserDocumentsPageOption
);

router.get(
  "/user-profile-edit-options",
  isAuth,
  mainController.getUserProfileEditPageOptions
);

router.get(
  "/settings-options",
  isAuth,
  mainController.getSettingsPageOptions
);

module.exports = router;
