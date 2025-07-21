const { Router } = require("express");
const router = Router();
const { MainController } = require("../../controllers");
const { isAuth, isAdmin, authId, isSupport } = require("../../middlewares");
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
  adminIndexPageOptionsValidation,
  adminCommentListOptionsValidation,
  adminDisputeListOptionsValidation,
  chatOptionsValidation,
  adminOthersListingCategoriesOptionsValidation,
  orderCheckoutValidation,
} = require("../../validations/main");
const { validateIdParam } = require("../../validations/base");
const { idParamValidation } = require("../../validations/listing");

module.exports = (io) => {
  const mainController = new MainController(io);

  router.get("/index-options", authId, mainController.getIndexPageOptions);

  router.get(
    "/view-page-options",
    mainController.getViewPageWithCategoriesOptions
  );

  router.get(
    "/create-listing-options",
    isAuth,
    mainController.getCreateListingPageOptions
  );

  router.get(
    "/update-listing-options/:id",
    isAuth,
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
    "/admin-dispute-prediction-model-list-options",
    isAuth,
    isAdmin,
    mainController.getAdminDisputePredictionModelListPageOptions
  );

  router.post(
    "/admin-dispute-prediction-model-list-options",
    isAuth,
    isAdmin,
    mainController.getAdminDisputePredictionModelListPageOptions
  );

  router.post(
    "/admin-dispute-prediction-model-list-options",
    isAuth,
    isAdmin,
    mainController.getAdminDisputePredictionModelListPageOptions
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
    "/admin-searched-others-categories-list-options",
    isAuth,
    isAdmin,
    adminOthersListingCategoriesOptionsValidation,
    mainController.getAdminOthersListingCategoriesOptions
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
    "/order-full-by-id-for-dispute-options/:id",
    isAuth,
    orderFullByIdOptionsValidation,
    mainController.getOrderFullByIdForDisputeOptions
  );

  router.get(
    "/get-order-for-card-pay-options/:id",
    isAuth,
    orderFullByIdOptionsValidation,
    mainController.getOrderFullForCardPay
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

  router.post(
    "/user-profile-edit-options",
    isAuth,
    mainController.getUserProfileEditPageOptions
  );

  router.post(
    "/dashboard-page-options",
    isAuth,
    mainController.getUserDashboardPageOptions
  );

  router.post(
    "/dashboard-options",
    isAuth,
    mainController.getUserDashboardOptions
  );

  router.post(
    "/order-list-options",
    isAuth,
    orderListOptionsValidation,
    mainController.getOrderListOptions
  );

  router.post(
    "/admin-order-list-options",
    isAuth,
    isSupport,
    adminOrderListOptionsValidation,
    mainController.getAdminOrderListOptions
  );

  router.post(
    "/admin-sender-payment-list-options",
    isAuth,
    isAdmin,
    adminOrderListOptionsValidation,
    mainController.getAdminSenderPaymentListOptions
  );

  router.get(
    "/admin-sender-payment-options/:id",
    isAuth,
    isAdmin,
    idParamValidation,
    mainController.getAdminSenderPaymentOptions
  );

  router.get(
    "/admin-recipient-payment-options/:id",
    isAuth,
    isAdmin,
    idParamValidation,
    mainController.getAdminRecipientPaymentOptions
  );

  router.post(
    "/admin-recipient-payment-list-options",
    isAuth,
    isAdmin,
    adminOrderListOptionsValidation,
    mainController.getAdminRecipientPaymentListOptions
  );

  router.get(
    "/get-order-invoice-options/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderInvoiceOptions
  );

  router.get(
    "/get-wallet-info-options",
    isAuth,
    mainController.getWalletInfoOptions
  );

  router.get(
    "/admin-waiting-refund-options/:id",
    isAuth,
    isAdmin,
    validateIdParam(),
    mainController.getAdminWaitingRefundById
  );

  router.get(
    "/get-waiting-refund-options/:id",
    isAuth,
    validateIdParam(),
    mainController.getWaitingRefundById
  );

  router.post(
    "/get-admin-dashboard-page-option",
    isAuth,
    isSupport,
    adminIndexPageOptionsValidation,
    mainController.getAdminDashboardPageOptions
  );

  router.post(
    "/get-admin-dashboard-option",
    isAuth,
    isSupport,
    adminIndexPageOptionsValidation,
    mainController.getAdminDashboardOptions
  );

  router.get(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    "/get-order-review-by-tenant/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderReviewByTenantOptions
=======
    "/get-order-review-by-renter/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderReviewByRenterOptions
>>>>>>> fad5f76 (start)
=======
    "/get-order-review-by-renter/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderReviewByRenterOptions
>>>>>>> 45e89f9 (start)
=======
    "/get-order-review-by-renter/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderReviewByRenterOptions
>>>>>>> 2cdae2d (start)
  );

  router.get(
    "/get-order-review-by-owner/:id",
    isAuth,
    validateIdParam(),
    mainController.getOrderReviewByOwnerOptions
  );

  router.post(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    "/admin-tenant-comment-list-options",
    isAuth,
    isSupport,
    adminCommentListOptionsValidation,
    mainController.getAdminTenantCommentsPageOptions
=======
    "/admin-renter-comment-list-options",
    isAuth,
    isSupport,
    adminCommentListOptionsValidation,
    mainController.getAdminRenterCommentsPageOptions
>>>>>>> fad5f76 (start)
=======
    "/admin-renter-comment-list-options",
    isAuth,
    isSupport,
    adminCommentListOptionsValidation,
    mainController.getAdminRenterCommentsPageOptions
>>>>>>> 45e89f9 (start)
=======
    "/admin-renter-comment-list-options",
    isAuth,
    isSupport,
    adminCommentListOptionsValidation,
    mainController.getAdminRenterCommentsPageOptions
>>>>>>> 2cdae2d (start)
  );

  router.post(
    "/admin-owner-comment-list-options",
    isAuth,
    isSupport,
    adminCommentListOptionsValidation,
    mainController.getAdminOwnerCommentsPageOptions
  );

  router.post(
    "/admin-dispute-list-options",
    isAuth,
    isSupport,
    adminDisputeListOptionsValidation,
    mainController.getAdminDisputesPageOptions
  );

  router.post(
    "/user-chat-options",
    isAuth,
    chatOptionsValidation,
    mainController.getUserChatOptions
  );

  router.post(
    "/admin-chat-options",
    isAuth,
    isSupport,
    chatOptionsValidation,
    mainController.getAdminChatOptions
  );

  router.post(
    "/admin-order-chat-options",
    isAuth,
    isSupport,
    chatOptionsValidation,
    mainController.getAdminOrderChatOptions
  );

  router.get(
    "/admin-create-category-by-others-options",
    isAuth,
    isAdmin,
    mainController.getAdminCreateCategoryByOtherOptions
  );

  router.post("/address-to-coords", isAuth, mainController.getAddressCoords);

  router.post("/coords-to-address", isAuth, mainController.getCoordsAddress);

  router.post(
    "/check-more-query",
    isAuth,
    isAdmin,
    mainController.checkModelQuery
  );

  router.get(
    "/get-order-checkout-info/:id",
    isAuth,
    orderCheckoutValidation,
    mainController.getOrderCheckoutInfo
  );

  router.get(
    "/get-dispute-prediction-model-details/:id",
    isAuth,
    isAdmin,
    idParamValidation,
    mainController.getDisputePredictionModelDetails
  );

  router.get("/test", mainController.test);

  router.get(
    "/get-table-relations",
    isAuth,
    isAdmin,
    mainController.getTableRelations
  );

  return router;
};
