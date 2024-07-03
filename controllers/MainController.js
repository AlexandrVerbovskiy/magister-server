require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
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

const coordsByIp = require("../utils/coordsByIp");
const {
  cloneObject,
  generateDatesByTypeBetween,
  checkDateInDuration,
  getDaysDifference,
  isDateAfterStartDate,
  getProfileData,
} = require("../utils");
const TenantCommentController = require("./TenantCommentController");
const OwnerCommentController = require("./OwnerCommentController");
const ListingCommentController = require("./ListingCommentController");
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
    this.listingCommentController = new ListingCommentController(io);
    this.disputeController = new DisputeController(io);
    this.chatController = new ChatController(io);
  }

  getNavigationCategories = () =>
    this.listingCategoryModel.listGroupedByLevel();

  getListingDefects = () => this.listingDefectModel.getAll();

  getListingDefectQuestions = () => this.listingDefectQuestionModel.getAll();

  getViewPageWithCategoriesOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoryModel.getFullInfoList();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getIndexPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const categories = await this.listingCategoryModel.getFullInfoList();

      /* const topListings = await this.listingModel.getTopListings();

            if (!userId) {
              return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
                topListings,
                categories,
              });
            }

            const ratingListingsWithImagesFavorites =
              await this.userListingFavoriteModel.bindUserListingListFavorite(
                topListings,
                userId
              );*/

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
      const defects = await this.getListingDefects();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        defects,
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
      const defects = await this.getListingDefects();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        listing,
        lastRequestInfo,
        canChange: !countUnfinishedListingOrders,
        defects,
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

  baseGetListingListPageOptions = async (req, res, ownerId = null) => {
    const searchCategories = cloneObject(req.body.categories) ?? [];
    let needSubscriptionNewCategory = false;
    let hasListings = false;
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

    if (searchCategories.length != 1 || !needSubscriptionNewCategory) {
      const { countItems } = await this.listingController.baseCountListings(
        req,
        ownerId
      );
      hasListings = countItems > 0;
    }

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

      if (
        !listing ||
        ((!listing.userVerified || !listing.approved) &&
          listing.ownerId != userId)
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
          await this.orderModel.getBlockedListingsDatesForUser(
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

      const comments = await this.listingCommentModel.listForEntity(listing.id);

      const listingRatingInfo =
        await this.listingCommentModel.getListingDetailInfo(listing.id);
      const ownerRatingInfo = await this.ownerCommentModel.getUserDetailInfo(
        listing.ownerId
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        listing,
        categories,
        tenantBaseCommissionPercent,
        comments,
        listingRatingInfo,
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

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order: { ...order, ...dopOrderOptions },
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

  getOrderFullForCardPay = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const order = await this.orderModel.getFullById(id);
      const bankAccount = await this.systemOptionModel.getBankAccountInfo();
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order,
        bankAccount,
        categories,
      });
    });

  getOrderTenantQrCodeInfo = (req, res) => {
    const { token } = req.params;

    const getOrderByRequest = () =>
      this.orderModel.getFullByTenantListingToken(token);

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

    const getDopOptions = async () => {
      const questions = await this.getListingDefectQuestions();
      return { questions };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions,
      getDopOptions
    );
  };

  getOrderOwnerQrCodeInfo = (req, res) => {
    const { token } = req.params;

    const getOrderByRequest = () =>
      this.orderModel.getFullByOwnerListingToken(token);

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

    const getDopOptions = async () => {
      const questions = await this.getListingDefectQuestions();
      return { questions };
    };

    return this.baseGetFullOrderInfo(
      req,
      res,
      getOrderByRequest,
      getDopOrderOptions,
      getDopOptions
    );
  };

  getAdminListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const listingListOptions =
        await this.listingController.baseListingWithStatusesList(req);

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
      const defects = await this.getListingDefects();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        defects,
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
      const defects = await this.getListingDefects();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        listing,
        defects,
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

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        request,
        listing,
      });
    });

  getUserProfileEditPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getSettingsPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
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
        countForOwner = await this.orderModel.ownerOrdersTotalCount(
          "",
          {},
          userId
        );
        countForTenant = result.countItems;
      } else {
        countForTenant = await this.orderModel.tenantOrdersTotalCount(
          "",
          {},
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
      const order = await this.orderModel.getFullById(id);
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

  getAdminListingDefectsEditOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const defects = await this.getListingDefects();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        defects,
      });
    });

  getAdminListingDefectQuestionsEditOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const questions = await this.getListingDefectQuestions();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        questions,
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

  getAdminIndexPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        timeFilterType,
        clientFromTime,
        serverFromTime,
        clientToTime,
        serverToTime,
        clientServerHoursDiff,
      } = await this.listTimeNameOption(req);

      let stepType = "days";

      if (timeFilterType === "last-year") {
        stepType = "months";
      }

      if (timeFilterType === "last-day") {
        stepType = "hours";
      }

      const generatedDates = generateDatesByTypeBetween(
        clientFromTime,
        clientToTime,
        stepType
      );

      const rentListingCounts = cloneObject(generatedDates);

      const rentListingInfos = await this.orderModel.getInUseListings(
        clientFromTime,
        clientToTime
      );

      rentListingInfos.forEach((info) => {
        Object.keys(rentListingCounts).forEach((key) => {
          const startInfo = info["startDate"];
          const endInfo = info["endDate"];

          if (checkDateInDuration(key, startInfo, endInfo, stepType)) {
            rentListingCounts[key]++;
          }
        });
      });

      const transactionDatesCount = cloneObject(generatedDates);
      const transactionDatesSum = cloneObject(generatedDates);

      const transactionInfos =
        await this.senderPaymentModel.getSendersByDuration(
          serverFromTime,
          serverToTime
        );

      const transactionsDetailInfo = {
        paypal: { amount: 0, count: 0 },
        bankTransfer: { amount: 0, count: 0 },
      };

      transactionInfos.forEach((info) => {
        Object.keys(transactionDatesCount).forEach((key) => {
          if (
            checkDateInDuration(
              key,
              info["createdAt"],
              info["createdAt"],
              stepType,
              clientServerHoursDiff
            )
          ) {
            transactionDatesCount[key]++;
          }
        });

        Object.keys(transactionDatesSum).forEach((key) => {
          if (
            checkDateInDuration(
              key,
              info["createdAt"],
              info["createdAt"],
              stepType,
              clientServerHoursDiff
            )
          ) {
            const sum =
              getDaysDifference(info["startDate"], info["endDate"]) *
              info["pricePerDay"];
            transactionDatesSum[key] += sum;

            const payType =
              info["type"] == "paypal" ? "paypal" : "bankTransfer";

            transactionsDetailInfo[payType]["amount"] += sum;
            transactionsDetailInfo[payType]["count"] += 1;
          }
        });
      });

      const userRegisterDatesCount = cloneObject(generatedDates);
      const userInactiveRegisterDatesCount = cloneObject(generatedDates);
      const userTotalDatesCount = cloneObject(generatedDates);

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

      userInactiveInfos.forEach((info) => {
        Object.keys(userInactiveRegisterDatesCount).forEach((key) => {
          if (
            isDateAfterStartDate(
              key,
              info["createdAt"],
              stepType,
              clientServerHoursDiff
            )
          ) {
            userInactiveRegisterDatesCount[key] += 1;
          }
        });
      });

      userRegisterInfos.forEach((info) => {
        Object.keys(userRegisterDatesCount).forEach((key) => {
          if (
            isDateAfterStartDate(
              key,
              info["createdAt"],
              stepType,
              clientServerHoursDiff
            )
          ) {
            userRegisterDatesCount[key] += 1;
          }
        });

        Object.keys(userTotalDatesCount).forEach((key) => {
          if (
            isDateAfterStartDate(
              key,
              info["createdAt"],
              stepType,
              clientServerHoursDiff
            )
          ) {
            userTotalDatesCount[key] += 1;
          }
        });
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        timeFilterType,
        userRegisterDatesCount,
        userInactiveRegisterDatesCount,
        userTotalDatesCount,
        transactionDatesCount,
        transactionDatesSum,
        rentListingCounts,
        transactionsDetailInfo,
      });
    });

  getOrderReviewByTenantOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const { userId } = req.userData;

      const categories = await this.getNavigationCategories();
      const order = await this.orderModel.getFullById(id);

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
      const order = await this.orderModel.getFullById(id);

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

  getAdminListingCommentsPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.listingCommentController.baseCommentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  createOwnerComment = async (req, res) => {
    const { userCommentInfo, listingCommentInfo, orderId } = req.body;
    const senderId = req.userData.userId;

    const orderHasOwnerComment =
      await this.ownerCommentModel.checkOrderHasComment(orderId);

    if (orderHasOwnerComment) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const orderHasListingComment =
      await this.listingCommentModel.checkOrderHasComment(orderId);

    if (orderHasListingComment) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const ownerCommentId = await this.ownerCommentModel.create({
      ...userCommentInfo,
      orderId,
    });

    const listingCommentId = await this.listingCommentModel.create({
      ...listingCommentInfo,
      orderId,
    });

    const order = await this.orderModel.getById(orderId);
    const chatId = order.chatId;

    const listingMessage =
      await this.chatMessageModel.createListingReviewMessage({
        chatId,
        senderId,
        data: listingCommentInfo,
      });

    const ownerMessage = await this.chatMessageModel.createUserReviewMessage({
      chatId,
      senderId,
      data: { ...userCommentInfo, type: "owner" },
    });

    const sender = await this.userModel.getById(senderId);

    this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
      message: listingMessage,
      opponent: sender,
    });

    this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
      message: ownerMessage,
      opponent: sender,
    });

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      ownerCommentId,
      listingCommentId,
    });
  };

  createTenantComment = async (req, res) => {
    const { userCommentInfo, orderId } = req.body;
    const senderId = req.userData.userId;

    const orderHasTenantComment =
      await this.tenantCommentModel.checkOrderHasComment(orderId);

    if (orderHasTenantComment) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const tenantCommentId = await this.tenantCommentModel.create({
      ...userCommentInfo,
      orderId,
    });

    const order = await this.orderModel.getById(orderId);
    const chatId = order.chatId;

    const tenantMessage = await this.chatMessageModel.createUserReviewMessage({
      chatId,
      senderId,
      data: { ...userCommentInfo, type: "tenant" },
    });

    const sender = await this.userModel.getById(senderId);

    this.sendSocketMessageToUserOpponent(chatId, senderId, "get-message", {
      message: tenantMessage,
      opponent: sender,
    });

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      tenantCommentId,
    });
  };

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

  test = async (req, res) => {
    const authCode = req.query.code;
    console.log("Authorization Code:", authCode);
    console.log("test");
    return res.send("success");
  };

  test2 = async (req, res) => {
    const authCode =
      "C21AAKvzmSFk2Mqrln87sp99-5QNfgpSRTT0W0_I8DAtGwnKCcJVFC78GH2b0qysZZjIB5HT_13FnZSNEHqiUuJkX5rvRy-zQ";

    const result = await getProfileData(authCode);
    console.log(result);
    res.send("test");
  };
}

module.exports = MainController;
