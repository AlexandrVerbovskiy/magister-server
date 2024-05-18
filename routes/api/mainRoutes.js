const { Router } = require("express");
const router = Router();
const { mainController } = require("../../controllers");
const {
  isAuth,
  isVerified,
  isAdmin,
  authId,
  isVerifiedAndHasPaypalId,
} = require("../../middlewares");
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
  ownerListingListOptionsValidation,
  userNameIdListValidation,
  adminListingApprovalRequestListOptionsValidation,
  adminListingApprovalRequestOptionsValidation,
  userDocumentsOptionsValidation,
  listingFullByIdOptionsValidation,
  orderFullByIdOptionsValidation,
  orderFullByTokenOptionsValidation,
  orderListOptionsValidation,
  adminOrderListOptionsValidation,
  recipientPaymentListValidation,
  senderPaymentListValidation,
} = require("../../validations/main");
const isSupport = require("../../middlewares/isSupport");
const { validateIdParam } = require("../../validations/base");

router.get("/index-options", mainController.getIndexPageOptions);

router.get(
  "/create-listing-options",
  isAuth,
  isVerified,
  isVerifiedAndHasPaypalId,
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

router.post(
  "/owner-listing-list-options",
  authId,
  ownerListingListOptionsValidation,
  mainController.getOwnerListingListPageOptions
);

router.get(
  "/listing-full-by-id-options/:id",
  authId,
  listingFullByIdOptionsValidation,
  mainController.getListingFullByIdOptions
);

router.get(
  "/order-full-by-id-options/:id",
  isAuth,
  orderFullByIdOptionsValidation,
  mainController.getOrderFullByIdOptions
);

router.get(
  "/tenant-scanning-listing-rental-code/:token",
  isAuth,
  orderFullByTokenOptionsValidation,
  mainController.getOrderTenantQrCodeInfo
);

router.get(
  "/owner-scanning-listing-rental-code/:token",
  isAuth,
  orderFullByTokenOptionsValidation,
  mainController.getOrderOwnerQrCodeInfo
);

router.post(
  "/user-listing-list-options",
  isAuth,
  isVerifiedAndHasPaypalId,
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
  "/admin-full-order-info-options/:id",
  isAuth,
  isSupport,
  validateIdParam(),
  mainController.getFullOrderByIdPageOption
);

router.get(
  "/admin-full-booking-info-options/:id",
  isAuth,
  isSupport,
  validateIdParam(),
  mainController.getFullOrderByIdWithRequestsToUpdatePageOption
);

router.get(
  "/user-profile-edit-options",
  isAuth,
  mainController.getUserProfileEditPageOptions
);

router.get("/settings-options", isAuth, mainController.getSettingsPageOptions);

router.post(
  "/booking-list-options",
  isAuth,
  isVerified,
  orderListOptionsValidation,
  mainController.getBookingListOptions
);

router.post(
  "/order-list-options",
  isAuth,
  isVerifiedAndHasPaypalId,
  orderListOptionsValidation,
  mainController.getOrderListOptions
);

router.post(
  "/admin-booking-list-options",
  isAuth,
  isSupport,
  adminOrderListOptionsValidation,
  mainController.getAdminBookingListOptions
);

router.post(
  "/admin-order-list-options",
  isAuth,
  isSupport,
  adminOrderListOptionsValidation,
  mainController.getAdminOrderListOptions
);

router.post(
  "/sender-payment-list-options",
  isAuth,
  isVerifiedAndHasPaypalId,
  senderPaymentListValidation,
  mainController.getSenderPaymentListOptions
);

router.post(
  "/recipient-payment-list-options",
  isAuth,
  isVerifiedAndHasPaypalId,
  recipientPaymentListValidation,
  mainController.getRecipientPaymentListOptions
);

router.post(
  "/admin-sender-payment-list-options",
  isAuth,
  isAdmin,
  adminOrderListOptionsValidation,
  mainController.getAdminSenderPaymentListOptions
);

router.post(
  "/admin-recipient-payment-list-options",
  isAuth,
  isAdmin,
  adminOrderListOptionsValidation,
  mainController.getAdminRecipientPaymentListOptions
);

router.get(
  "/admin-listing-defects-edit-options",
  isAuth,
  isAdmin,
  mainController.getAdminListingDefectsEditOptions
);

router.get(
  "/admin-listing-defect-questions-edit-options",
  isAuth,
  isAdmin,
  mainController.getAdminListingDefectQuestionsEditOptions
);

router.get(
  "/get-order-invoice-options/:id",
  isAuth,
  isVerifiedAndHasPaypalId,
  validateIdParam(),
  mainController.getOrderInvoiceOptions
);

router.get(
  "/get-wallet-info-options",
  isAuth,
  mainController.getWalletInfoOptions
);

module.exports = router;
