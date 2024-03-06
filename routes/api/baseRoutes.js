const { Router } = require("express");
const router = Router();
const { baseController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/index-options", baseController.getIndexPageOptions);

router.get("/listing-list-options", baseController.getListingListPageOptions);

router.get(
  "/create-listing-options",
  isAuth,
  baseController.getCreateListingPageOptions
);

router.get(
  "/update-listing-options/:id",
  isAuth,
  baseController.getUpdateListingPageOptions
);

router.post(
  "/user-listing-list-options",
  isAuth,
  baseController.getUserListingListPageOptions
);

router.get(
  "/current-user-documents-options",
  isAuth,
  baseController.getCurrentUserDocumentsPageOptions
);

router.get(
  "/admin-update-listing-options/:id",
  isAuth,
  isAdmin,
  baseController.getAdminListingEditPageOptions
);

router.post(
  "/admin-user-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminUserListPageOptions
);

router.post(
  "/admin-log-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminLogListPageOptions
);

router.post(
  "/admin-user-event-log-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminUserEventLogListPageOptions
);

router.post(
  "/admin-user-verify-request-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminUserUserVerifyRequestListPageOptions
);

router.post(
  "/admin-searched-word-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminSearchedWordListPageOptions
);

router.post(
  "/admin-listing-list-options",
  isAuth,
  isAdmin,
  baseController.getAdminListingListPageOptions
);

router.post(
  "/user-name-id-list",
  baseController.userNameIdList
);

module.exports = router;
