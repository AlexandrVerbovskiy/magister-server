require("dotenv").config();
const STATIC = require("../static");
const Controller = require("./Controller");
const ListingController = require("./ListingController");
const UserController = require("./UserController");
const LogController = require("./LogController");
const UserEventLogController = require("./UserEventLogController");
const UserVerifyRequestController = require("./UserVerifyRequestController");
const SearchedWordController = require("./SearchedWordController");
const ListingApprovalRequestController = require("./ListingApprovalRequestController");
const OrderController = require("./OrderController");
const SenderPaymentController = require("./SenderPaymentController");
const RecipientPaymentController = require("./RecipientPaymentController");
const ListingCategoriesController = require("./ListingCategoriesController");

const coordsByIp = require("../utils/coordsByIp");
const {
  cloneObject,
  generateDatesByTypeBetween,
  checkDateInDuration,
  isDateAfterStartDate,
  getUserPaypalId,
  incrementDateCounts,
  incrementDateSums,
  determineStepType,
  getFactOrderDays,
  getAddressByCoords,
  getCoordsByAddress,
} = require("../utils");
const TenantCommentController = require("./TenantCommentController");
const OwnerCommentController = require("./OwnerCommentController");
const DisputeController = require("./DisputeController");
const ChatController = require("./ChatController");

class MainController extends Controller {
  constructor(io) {
    super(io);

    this.listingController = new ListingController(io);
    this.userController = new UserController(io);
    this.logController = new LogController(io);
    this.userEventLogController = new UserEventLogController(io);
    this.userVerifyRequestController = new UserVerifyRequestController(io);
    this.searchedWordController = new SearchedWordController(io);
    this.listingApprovalRequestController =
      new ListingApprovalRequestController(io);
    this.orderController = new OrderController(io);
    this.senderPaymentController = new SenderPaymentController(io);
    this.recipientPaymentController = new RecipientPaymentController(io);
    this.tenantCommentController = new TenantCommentController(io);
    this.ownerCommentController = new OwnerCommentController(io);
    this.disputeController = new DisputeController(io);
    this.chatController = new ChatController(io);
    this.listingCategoriesController = new ListingCategoriesController(io);
  }

  getNavigationCategories = () =>
    this.listingCategoryModel.listGroupedByLevel();

  getViewPageWithCategoriesOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoryModel.getFullInfoList();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getIndexPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoryModel.getFullInfoList();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
        coords,
      });
    });

  getCreateListingPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getUpdateListingPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const id = req.params.id;
      const userId = req.userData.userId;
      const listing = await this.listingModel.getById(id);

      const countUnfinishedListingOrders =
        await this.orderModel.getUnfinishedListingCount(id);

      const lastRequestInfo =
        await this.listingApprovalRequestModel.lastListingApprovalRequestInfo(
          id
        );

      if (!listing) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (userId != listing["ownerId"]) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        listing,
        lastRequestInfo,
        canChange: !countUnfinishedListingOrders,
      });
    });

  getUserListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;

      const result = await this.listingController.baseListingWithStatusesList(
        req,
        userId
      );

      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
      });
    });

  getAdminUserListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.userController.baseUserList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminLogListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const logListOptions = await this.logController.baseLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...logListOptions,
      });
    });

  getAdminUserEventLogListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const eventLogListOptions =
        await this.userEventLogController.baseUserEventLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...eventLogListOptions,
      });
    });

  getAdminUserUserVerifyRequestListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userVerifyRequestListOptions =
        await this.userVerifyRequestController.baseUserVerifyRequestList(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...userVerifyRequestListOptions,
      });
    });

  getAdminSearchedWordListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const searchedWordListOptions =
        await this.searchedWordController.baseSearchedWordList(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...searchedWordListOptions,
      });
    });

  getAdminOthersListingCategoriesOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const othersCategoriesListOptions =
        await this.listingCategoriesController.baseGetOtherCategories(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...othersCategoriesListOptions,
      });
    });

  baseGetListingListPageOptions = async (req, res, ownerId = null) => {
    const searchCategories = cloneObject(req.body.categories) ?? [];
    let needSubscriptionNewCategory = false;
    let hasListings = true;
    const userId = req.userData.userId;

    if (req.body.searchCategory) {
      searchCategories.push(req.body.searchCategory);
    }

    if (searchCategories.length == 1) {
      const foundCategory = await this.listingCategoryModel.getByName(
        searchCategories[0]
      );

      if (!foundCategory) {
        if (userId) {
          const hasNotify =
            await this.listingCategoryCreateNotificationModel.checkUserHasCategoryNotify(
              userId,
              searchCategories[0]
            );
          needSubscriptionNewCategory = !hasNotify;
        } else {
          needSubscriptionNewCategory = true;
        }
      }
    }

    const { countItems } = await this.listingController.baseCountListings(
      req,
      ownerId
    );

    hasListings = countItems > 0;

    const categories = await this.getNavigationCategories();

    const coords = await coordsByIp(req.body.clientIp ?? null);
    req.body.lat = coords.lat;
    req.body.lng = coords.lng;

    const result = await this.listingController.baseListingList(req, ownerId);

    const priceLimits = await this.listingModel.priceLimits();

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      categories,
      needSubscriptionNewCategory,
      hasListings,
      ...result,
      priceLimits,
    });
  };

  getMainListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      return await this.baseGetListingListPageOptions(req, res);
    });

  getOwnerListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const ownerId = req.body.ownerId;
      return await this.baseGetListingListPageOptions(req, res, ownerId);
    });

  getListingFullByIdOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData?.userId;

      const listing = await this.listingModel.getFullById(id);

      let isAdmin = false;

      if (userId) {
        isAdmin = await this.userModel.checkIsAdmin(userId);
      }

      if (
        !listing ||
        (!listing.approved && listing.ownerId != userId && !isAdmin)
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing wasn't found"
        );
      }

      if (userId) {
        listing["favorite"] =
          await this.userListingFavoriteModel.checkUserListingHasRelation(
            userId,
            id
          );
      }

      if (userId) {
        const blockedDates =
          await this.orderModel.getBlockedListingsDatesForListings(
            [listing.id],
            userId
          );

        listing["blockedDates"] = blockedDates[listing.id];
      } else {
        listing["blockedDates"] = [];
      }

      const tenantBaseCommissionPercent =
        await this.systemOptionModel.getTenantBaseCommissionPercent();

      const categories = await this.getNavigationCategories();

      const comments = await this.ownerCommentModel.listForEntity(
        listing.ownerId
      );

      const ownerRatingInfo = await this.ownerCommentModel.getUserDetailInfo(
        listing.ownerId
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        listing,
        categories,
        tenantBaseCommissionPercent,
        comments,
        ownerRatingInfo,
      });
    });

  baseGetFullOrderInfo = (
    req,
    res,
    getOrderByRequest,
    getDopOrderOptions = null,
    getDopOptions = null
  ) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      let order = await getOrderByRequest();

      if (!order || (userId != order.tenantId && userId != order.ownerId)) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Order wasn't found"
        );
      }

      order = await this.orderController.wrapOrderFullInfo(order, userId);

      const categories = await this.getNavigationCategories();

      const dopOrderOptions = getDopOrderOptions
        ? await getDopOrderOptions(order)
        : {};

      const dopOptions = getDopOptions ? await getDopOptions(order) : {};

      const {
        ownerBaseCommissionPercent: ownerBaseCommission,
        tenantBaseCommissionPercent: tenantBaseCommission,
        tenantCancelFeePercent: tenantCancelFee,
      } = await this.systemOptionModel.getCommissionInfo();

      const bankInfo = await this.systemOptionModel.getBankAccountInfo();

      order = await this.ownerCommentModel.bindAverageForKeyEntity(
        order,
        "ownerId",
        {
          commentCountName: "ownerCommentCount",
          averageRatingName: "ownerAverageRating",
        }
      );

      order = await this.tenantCommentModel.bindAverageForKeyEntity(
        order,
        "tenantId",
        {
          commentCountName: "tenantCommentCount",
          averageRatingName: "tenantAverageRating",
        }
      );

      const canViewFullInfo = order.ownerId === userId;

      const conflictOrdersList = await this.orderModel.getConflictOrders(
        [order.id],
        canViewFullInfo
      );

      const conflictOrders = conflictOrdersList[order.id];

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order: { ...order, ...dopOrderOptions, conflictOrders },
        categories,
        ...dopOptions,
        ownerBaseCommission,
        tenantBaseCommission,
        tenantCancelFee,
        bankInfo,
      });
    });

  getOrderFullByIdOptions = (req, res) => {
    const { id } = req.params;
    const userId = req.userData.userId;

    const getOrderByRequest = () =>
      this.orderModel.getFullWithCommentsById(id, userId);

    const getDopOrderOptions = async (order) => {
      const paymentInfo =
        await this.senderPaymentModel.getInfoAboutOrderPayment(order.id);

      return {
        canFastCancelPayed: this.orderModel.canFastCancelPayedOrder(order),
        paymentInfo,
      };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions
    );
  };

  getOrderFullByIdForDisputeOptions = (req, res) => {
    const { id } = req.params;
    const userId = req.userData.userId;

    const getOrderByRequest = async () => {
      const order = await this.orderModel.getFullWithCommentsById(id, userId);

      if (order && order.orderParentId) {
        return null;
      }

      return order;
    };

    const getDopOrderOptions = async (order) => {
      const paymentInfo =
        await this.senderPaymentModel.getInfoAboutOrderPayment(order.id);

      return {
        canFastCancelPayed: this.orderModel.canFastCancelPayedOrder(order),
        paymentInfo,
      };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions
    );
  };

  getOrderFullForCardPay = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const order = await this.orderModel.getFullById(id);
      const bankAccount = await this.systemOptionModel.getBankAccountInfo();
      const categories = await this.getNavigationCategories();

      if (
        order.cancelStatus ||
        order.disputeStatus ||
        order.status != STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order,
        bankAccount,
        categories,
      });
    });

  getOrderTenantQrCodeInfo = (req, res) => {
    const { token } = req.params;

    const getOrderByRequest = async () => {
      const order = await this.orderModel.getFullByTenantListingToken(token);

      if (order && order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) {
        return null;
      }

      return order;
    };

    const getDopOrderOptions = async () => {
      const {
        ownerBaseCommissionPercent: ownerBaseFee,
        tenantBaseCommissionPercent: tenantBaseFee,
        tenantCancelFeePercent: tenantCancelFee,
      } = await this.systemOptionModel.getCommissionInfo();

      return {
        canAcceptTenantListing: true,
        acceptListingTenantToken: token,
        tenantCancelFee,
        ownerBaseFee,
        tenantBaseFee,
      };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions
    );
  };

  getOrderOwnerQrCodeInfo = (req, res) => {
    const { token } = req.params;

    const getOrderByRequest = async () => {
      const order = await this.orderModel.getFullByOwnerListingToken(token);

      if (order && order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
        return null;
      }

      return order;
    };

    const getDopOrderOptions = async (order) => {
      const {
        ownerBaseCommissionPercent: ownerBaseFee,
        tenantBaseCommissionPercent: tenantBaseFee,
        tenantCancelFeePercent: tenantCancelFee,
      } = await this.systemOptionModel.getCommissionInfo();

      return {
        canAcceptOwnerListing: true,
        acceptListingOwnerToken: token,
        canFinalization: this.orderModel.canFinalizationOrder(order),
        tenantCancelFee,
        ownerBaseFee,
        tenantBaseFee,
      };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions
    );
  };

  getAdminListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const listingListOptions =
        await this.listingController.baseListingWithApprovedWaitedStatusesList(
          req
        );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...listingListOptions,
      });
    });

  getCurrentUserDocumentsPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      const documents = await this.userModel.getDocumentsByUserId(userId);

      const hasUnansweredRequest =
        await this.userVerifyRequestModel.checkUserHasUnansweredRequest(userId);

      const lastAnsweredRequest =
        await this.userVerifyRequestModel.getLastUserAnsweredRequest(userId);

      const lastAnswerDescription = lastAnsweredRequest
        ? lastAnsweredRequest.failedDescription
        : null;

      const categories = await this.getNavigationCategories();

      const countUnfinishedUserOrders =
        await this.orderModel.getUnfinishedUserCount(userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
        canSend: !hasUnansweredRequest,
        lastAnswerDescription,
        categories,
        canChange: !countUnfinishedUserOrders,
      });
    });

  getUserDocumentsPageOption = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const documents = await this.userModel.getDocumentsByUserId(id);
      const user = await this.userModel.getFullById(id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
        user,
      });
    });

  getAdminListingCreatePageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getAdminListingEditPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const id = req.params.id;
      const listing = await this.listingModel.getFullById(id);

      if (!listing) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        listing,
      });
    });

  userNameIdList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { page = 1, perPage = 20, filter = "" } = req.body;
      const startIndex = (page - 1) * perPage;
      const list = await this.userModel.getNameIdList(
        startIndex,
        perPage,
        filter
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { list });
    });

  getUserListingApprovalRequestListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result =
        await this.listingApprovalRequestController.baseRequestsList(
          req,
          userId
        );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminListingApprovalRequestListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result =
        await this.listingApprovalRequestController.baseRequestsList(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminListingApprovalRequestPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const request = await this.listingApprovalRequestModel.getById(id);

      if (!request.id) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const { listingId } = request;

      const listing = await this.listingModel.getFullById(listingId);

      if (!listing) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing not found"
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        request,
        listing,
      });
    });

  getUserProfileEditPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const paypalCode = req.body.paypalCode;
      const userId = req.userData.userId;

      let newPaypalId = null;

      if (paypalCode) {
        const result = await getUserPaypalId(paypalCode);

        if (result.error) {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.BAD_REQUEST,
            result.error
          );
        } else {
          newPaypalId = result.paypalId;
          await this.userModel.setPaypalId(userId, newPaypalId);
        }
      }

      const categories = await this.getNavigationCategories();

      const verifiedInfo =
        await this.userVerifyRequestModel.getLastUserNotAnsweredRequest(userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        newPaypalId,
        verifiedInfo,
      });
    });

  getOrderListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const isForTenant = req.body.type !== "owner";
      const {
        ownerBaseCommissionPercent: ownerBaseFee,
        tenantBaseCommissionPercent: tenantBaseFee,
        tenantCancelFeePercent: tenantCancelFee,
        bankAccountIban,
        bankAccountSwiftBic,
        bankAccountBeneficiary,
        bankAccountReferenceConceptCode,
      } = await this.systemOptionModel.getOptions();

      const request = isForTenant
        ? this.orderController.baseTenantOrderList
        : this.orderController.baseListingOwnerOrderList;

      const result = await request(req);
      const categories = await this.getNavigationCategories();

      let countForTenant = 0;
      let countForOwner = 0;

      if (isForTenant) {
        countForOwner = await this.orderModel.ownerOrdersTotalCount("", userId);
        countForTenant = result.countItems;
      } else {
        countForTenant = await this.orderModel.tenantOrdersTotalCount(
          "",
          userId
        );
        countForOwner = result.countItems;
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
        tenantCancelFee,
        ownerBaseFee,
        tenantBaseFee,
        countForTenant,
        countForOwner,
        bankInfo: {
          bankAccountIban,
          bankAccountSwiftBic,
          bankAccountBeneficiary,
          bankAccountReferenceConceptCode,
        },
      });
    });

  getAdminOrderListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.orderController.baseAdminOrderList(req);
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
      });
    });

  getFullOrderByIdPageOption = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const order = await this.orderModel.getFullWithPaymentAndChecklistsById(
        id
      );

      order["requestsToUpdate"] =
        await this.orderUpdateRequestModel.getAllForOrder(id);

      if (!order) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Order wasn't found"
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  getAdminSenderPaymentListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result =
        await this.senderPaymentController.baseAllSenderPaymentList(
          req,
          null,
          STATIC.TIME_FILTER_TYPES.TYPE,
          true
        );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminSenderPaymentOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const payment = await this.senderPaymentModel.getFullById(id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        payment,
      });
    });

  getAdminRecipientPaymentOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const recipient = await this.recipientPaymentModel.getById(id);

      const refundCommission =
        await this.systemOptionModel.getTenantCancelCommissionPercent();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        recipient,
        refundCommission,
      });
    });

  getAdminRecipientPaymentListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result =
        await this.recipientPaymentController.baseAllRecipientPaymentList(
          req,
          null,
          STATIC.TIME_FILTER_TYPES.TYPE
        );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getOrderInvoiceOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const payment = await this.senderPaymentModel.getFullById(id);

      const categories = await this.getNavigationCategories();

      if (!payment || userId != payment.payerId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        payment,
      });
    });

  getWalletInfoOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();
      const { userId } = req.userData;

      const senderPaymentInfo =
        await this.senderPaymentController.baseAllSenderPaymentList(
          req,
          userId
        );

      const recipientPaymentInfo =
        await this.recipientPaymentController.baseAllRecipientPaymentList(
          req,
          userId,
          STATIC.TIME_FILTER_TYPES.DURATION
        );

      const totalPayed = await this.senderPaymentModel.getTotalPayed(userId);

      const totalGet = await this.recipientPaymentModel.getTotalGet(userId);

      const feeInfo = await this.systemOptionModel.getCommissionInfo();

      const totalOrders = await this.orderModel.getUserTotalCountOrders(userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        senderPaymentInfo,
        recipientPaymentInfo,
        totalPayed,
        totalGet,
        feeInfo,
        totalOrders,
      });
    });

  getWaitingRefundById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const { userId } = req.userData;

      const recipient = await this.recipientPaymentModel.getById(id);

      if (!recipient || recipient.recipientId !== userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const categories = await this.getNavigationCategories();

      const refundCommission =
        await this.systemOptionModel.getTenantCancelCommissionPercent();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        recipient,
        refundCommission,
        categories,
      });
    });

  getAdminWaitingRefundById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const recipient = await this.recipientPaymentModel.getById(id);

      if (!recipient) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const refundCommission =
        await this.systemOptionModel.getTenantCancelCommissionPercent();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        recipient,
        refundCommission,
      });
    });

  baseGetAdminDashboardOptions = async (req) => {
    const {
      timeFilterType,
      clientFromTime,
      serverFromTime,
      clientToTime,
      serverToTime,
      clientServerHoursDiff,
    } = await this.listTimeNameOption(req);

    const stepType = determineStepType(timeFilterType);

    const generatedDates = generateDatesByTypeBetween(
      clientFromTime,
      clientToTime,
      stepType
    );

    const rentListingCounts = cloneObject(generatedDates);
    const transactionDatesCount = cloneObject(generatedDates);
    const transactionDatesSum = cloneObject(generatedDates);
    const userRegisterDatesCount = cloneObject(generatedDates);
    const userInactiveRegisterDatesCount = cloneObject(generatedDates);
    const userTotalDatesCount = cloneObject(generatedDates);
    const disputeTotalDatesCount = cloneObject(generatedDates);

    const rentListingInfos = await this.orderModel.getInUseListings(
      clientFromTime,
      clientToTime
    );

    const rentListingTotalCounts = rentListingInfos.length;

    incrementDateCounts(rentListingCounts, rentListingInfos, (key, info) =>
      checkDateInDuration(key, info.startDate, info.endDate, stepType)
    );

    const disputeInfos = await this.disputeModel.getInDuration(
      clientFromTime,
      clientToTime
    );

    const disputeStatisticInfo = {
      allDisputes: disputeInfos.length,
      allActiveDisputes: disputeInfos.filter(
        (d) => d.status != STATIC.DISPUTE_STATUSES.SOLVED
      ).length,
      allSolvedDisputes: disputeInfos.filter(
        (d) => d.status == STATIC.DISPUTE_STATUSES.SOLVED
      ).length,
    };

    incrementDateCounts(disputeTotalDatesCount, disputeInfos, (key, info) =>
      checkDateInDuration(key, info.createdAt, info.solvedAt, stepType)
    );

    const transactionInfos = await this.senderPaymentModel.getSendersByDuration(
      serverFromTime,
      serverToTime
    );

    const transactionsDetailInfo = {
      [STATIC.PAYMENT_TYPES.PAYPAL]: { amount: 0, count: 0 },
      [STATIC.PAYMENT_TYPES.CREDIT_CARD]: { amount: 0, count: 0 },
      [STATIC.PAYMENT_TYPES.BANK_TRANSFER]: { amount: 0, count: 0 },
    };

    incrementDateCounts(transactionDatesCount, transactionInfos, (key, info) =>
      checkDateInDuration(
        key,
        info.createdAt,
        info.createdAt,
        stepType,
        clientServerHoursDiff
      )
    );

    incrementDateSums(
      transactionDatesSum,
      transactionInfos,
      (key, info) =>
        checkDateInDuration(
          key,
          info.createdAt,
          info.createdAt,
          stepType,
          clientServerHoursDiff
        ),
      (info) => {
        const sum =
          getFactOrderDays(info.startDate, info.endDate) * info.pricePerDay;
        transactionsDetailInfo[info.type].amount += sum;
        transactionsDetailInfo[info.type].count += 1;
        return sum;
      }
    );

    const totalUsersAtStart = await this.userModel.getTotalCountBeforeDate(
      serverFromTime
    );

    Object.keys(userTotalDatesCount).forEach(
      (date) => (userTotalDatesCount[date] = totalUsersAtStart)
    );

    const userRegisterInfos = await this.userModel.getRegisteredByDuration(
      serverFromTime,
      serverToTime
    );

    const userInactiveInfos =
      await this.userModel.getInactiveRegisteredByDuration(
        serverFromTime,
        serverToTime
      );

    incrementDateCounts(
      userInactiveRegisterDatesCount,
      userInactiveInfos,
      (key, info) =>
        isDateAfterStartDate(
          key,
          info.createdAt,
          stepType,
          clientServerHoursDiff
        )
    );

    incrementDateCounts(
      userRegisterDatesCount,
      userRegisterInfos,
      (key, info) =>
        isDateAfterStartDate(
          key,
          info.createdAt,
          stepType,
          clientServerHoursDiff
        )
    );

    incrementDateCounts(userTotalDatesCount, userRegisterInfos, (key, info) =>
      isDateAfterStartDate(key, info.createdAt, stepType, clientServerHoursDiff)
    );

    return {
      timeFilterType,
      userRegisterDatesCount,
      userInactiveRegisterDatesCount,
      userTotalDatesCount,
      transactionDatesCount,
      transactionDatesSum,
      rentListingCounts,
      rentListingTotalCounts,
      transactionsDetailInfo,
      disputeTotalDatesCount,
      disputeStatisticInfo,
    };
  };

  getAdminDashboardPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const options = await this.baseGetAdminDashboardOptions(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, options);
    });

  getAdminDashboardOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const options = await this.baseGetAdminDashboardOptions(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, options);
    });

  baseGetUserDashboardOptions = async (req) => {
    const userId = req.userData.userId;
    const {
      timeFilterType,
      clientFromTime,
      serverFromTime,
      clientToTime,
      serverToTime,
      clientServerHoursDiff,
    } = await this.listTimeNameOption(req);

    const stepType = determineStepType(timeFilterType);

    const generatedDates = generateDatesByTypeBetween(
      clientFromTime,
      clientToTime,
      stepType
    );

    const rentListingCounts = cloneObject(generatedDates);
    const transactionDatesCount = cloneObject(generatedDates);
    const transactionDatesSum = cloneObject(generatedDates);
    const disputeTotalDatesCount = cloneObject(generatedDates);

    const rentListingInfos = await this.orderModel.getInUseUserListings(
      clientFromTime,
      clientToTime,
      userId
    );

    const rentListingTotalCounts = rentListingInfos.length;

    const disputeInfos = await this.disputeModel.getUserInDuration(
      clientFromTime,
      clientToTime,
      userId
    );

    const disputeStatisticInfo = {
      allDisputes: disputeInfos.length,
      allActiveDisputes: disputeInfos.filter(
        (d) => d.status != STATIC.DISPUTE_STATUSES.SOLVED
      ).length,
      allSolvedDisputes: disputeInfos.filter(
        (d) => d.status == STATIC.DISPUTE_STATUSES.SOLVED
      ).length,
    };

    incrementDateCounts(disputeTotalDatesCount, disputeInfos, (key, info) =>
      checkDateInDuration(key, info.createdAt, info.solvedAt, stepType)
    );

    incrementDateCounts(rentListingCounts, rentListingInfos, (key, info) =>
      checkDateInDuration(key, info.startDate, info.endDate, stepType)
    );

    const transactionInfos =
      await this.senderPaymentModel.getUserSendersByDuration(
        serverFromTime,
        serverToTime,
        userId
      );

    const transactionsDetailInfo = {
      [STATIC.PAYMENT_TYPES.PAYPAL]: { amount: 0, count: 0 },
      [STATIC.PAYMENT_TYPES.CREDIT_CARD]: { amount: 0, count: 0 },
      [STATIC.PAYMENT_TYPES.BANK_TRANSFER]: { amount: 0, count: 0 },
    };

    incrementDateCounts(transactionDatesCount, transactionInfos, (key, info) =>
      checkDateInDuration(
        key,
        info.createdAt,
        info.createdAt,
        stepType,
        clientServerHoursDiff
      )
    );

    incrementDateSums(
      transactionDatesSum,
      transactionInfos,
      (key, info) =>
        checkDateInDuration(
          key,
          info.createdAt,
          info.createdAt,
          stepType,
          clientServerHoursDiff
        ),
      (info) => {
        const sum =
          getFactOrderDays(info.startDate, info.endDate) * info.pricePerDay;
        transactionsDetailInfo[info.type].amount += sum;
        transactionsDetailInfo[info.type].count += 1;
        return sum;
      }
    );

    return {
      timeFilterType,
      transactionDatesCount,
      transactionDatesSum,
      rentListingCounts,
      rentListingTotalCounts,
      transactionsDetailInfo,
      disputeStatisticInfo,
      disputeTotalDatesCount,
    };
  };

  getUserDashboardPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const options = await this.baseGetUserDashboardOptions(req);
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...options,
        categories,
      });
    });

  getUserDashboardOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const options = await this.baseGetUserDashboardOptions(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, options);
    });

  getOrderReviewByTenantOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const { userId } = req.userData;

      const categories = await this.getNavigationCategories();
      let order = await this.orderModel.getFullById(id);

      if (!order || order.orderParentId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      order = await this.ownerCommentModel.bindAverageForKeyEntity(
        order,
        "ownerId",
        {
          commentCountName: "ownerCommentCount",
          averageRatingName: "ownerAverageRating",
        }
      );

      order["ownerCountItems"] = await this.listingModel.getOwnerCountListings(
        order.ownerId
      );

      const hasComment = await this.ownerCommentModel.checkOrderHasComment(id);

      if (
        order.tenantId != userId ||
        order.status != STATIC.ORDER_STATUSES.FINISHED ||
        order.cancelStatus ||
        hasComment
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        order,
      });
    });

  getOrderReviewByOwnerOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const { userId } = req.userData;

      const categories = await this.getNavigationCategories();
      let order = await this.orderModel.getFullById(id);

      if (!order || order.orderParentId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      order = await this.tenantCommentModel.bindAverageForKeyEntity(
        order,
        "tenantId",
        {
          commentCountName: "tenantCommentCount",
          averageRatingName: "tenantAverageRating",
        }
      );

      order["tenantCountItems"] = await this.listingModel.getOwnerCountListings(
        order.tenantId
      );

      const hasComment = await this.tenantCommentModel.checkOrderHasComment(id);

      if (
        order.ownerId != userId ||
        order.status != STATIC.ORDER_STATUSES.FINISHED ||
        order.cancelStatus ||
        hasComment
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        order,
      });
    });

  getAdminTenantCommentsPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.tenantCommentController.baseCommentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminOwnerCommentsPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.ownerCommentController.baseCommentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminDisputesPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.disputeController.baseDisputeList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseGetChatOptions = ({
    req,
    res,
    getChatList,
    getMessageList,
    getEntityInfo,
    defaultEntityRes,
  }) =>
    this.baseWrapper(req, res, async () => {
      const chatId = req.body.id;
      const userId = req.userData.userId;
      const chatRes = await getChatList(req, res);

      if (chatRes.error) {
        return this.sendErrorResponse(res, chatRes.error);
      }

      const categories = await this.getNavigationCategories();

      let messageRes = {
        list: [],
        canShowMore: false,
        options: {},
        error: null,
      };

      if (chatId) {
        messageRes = await getMessageList(req, res);
      }

      if (messageRes.error) {
        return this.sendErrorResponse(res, messageRes.error);
      }

      let entityInfoRes = defaultEntityRes;

      if (chatId) {
        entityInfoRes = await getEntityInfo(chatId, userId);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        chats: chatRes.list,
        chatsCanShowMore: chatRes.canShowMore,
        options: { ...chatRes.options, ...messageRes.options },
        messages: messageRes.list,
        messagesCanShowMore: messageRes.canShowMore,
        ...entityInfoRes,
        ...chatRes.dopInfo,
      });
    });

  getUserChatOptions = (req, res) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;

    const getEntityInfo = () =>
      this.chatController.baseGetChatEntityInfo(chatId, userId);

    return this.baseGetChatOptions({
      req,
      res,
      getChatList: this.chatController.baseGetChatList,
      getMessageList: this.chatController.baseGetChatMessageList,
      getEntityInfo,
      defaultEntityRes: { entity: null, dopEntityInfo: {} },
    });
  };

  getAdminChatOptions = (req, res) => {
    const chatId = req.body.id;

    const getEntityInfo = () =>
      this.chatController.baseGetChatDisputeInfo(chatId);

    return this.baseGetChatOptions({
      req,
      res,
      getChatList: this.chatController.baseGetAdminChatList,
      getMessageList: this.chatController.baseGetAdminChatMessageList,
      getEntityInfo,
      defaultEntityRes: { order: null, dispute: null, dopInfo: {} },
    });
  };

  getAdminOrderChatOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {});
    });

  getAdminCreateCategoryByOtherOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const groupedCategories =
        await this.listingCategoryModel.listGroupedByLevel();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        groupedCategories,
      });
    });

  getAddressCoords = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const address = req.body.address;
      const result = await getCoordsByAddress({ address });
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getCoordsAddress = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { lat, lng } = req.body;
      const result = await getAddressByCoords({ lat, lng });
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getOrderCheckoutInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const { userId } = req.userData;

      const getOrderByRequest = async () => {
        const order = await this.orderModel.getFullWithCommentsById(id, userId);

        return order?.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
          ? order
          : null;
      };

      const getDopOrderOptions = async (order) => {
        const paymentInfo =
          await this.senderPaymentModel.getInfoAboutOrderPayment(order.id);

        return {
          canFastCancelPayed: this.orderModel.canFastCancelPayedOrder(order),
          paymentInfo,
        };
      };

      return this.baseGetFullOrderInfo(
        req,
        res,
        getOrderByRequest,
        getDopOrderOptions
      );
    });

  test = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.sendProfileVerificationMail(
        "cofeek5@gmail.com"
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = MainController;
