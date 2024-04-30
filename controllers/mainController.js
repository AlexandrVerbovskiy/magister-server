require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Controller = require("./Controller");
const listingController = require("./listingController");
const userController = require("./userController");
const logController = require("./logController");
const userEventLogController = require("./userEventLogController");
const userVerifyRequestController = require("./userVerifyRequestController");
const searchedWordController = require("./searchedWordController");
const listingApprovalRequestController = require("./listingApprovalRequestController");
const orderController = require("./orderController");

const coordsByIp = require("../utils/coordsByIp");
const { cloneObject } = require("../utils");

class MainController extends Controller {
  getNavigationCategories = () =>
    this.listingCategoriesModel.listGroupedByLevel();

  getIndexPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoriesModel.getFullInfoList();

      const topListings = await this.listingModel.getTopListings();

      const topListingsWithImages = await this.listingModel.listingsBindImages(
        topListings
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        topListings: topListingsWithImages,
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
      const result = await listingController.baseListingWithStatusesList(
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
      const result = await userController.baseUserList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminLogListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const logListOptions = await logController.baseLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...logListOptions,
      });
    });

  getAdminUserEventLogListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const eventLogListOptions =
        await userEventLogController.baseUserEventLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...eventLogListOptions,
      });
    });

  getAdminUserUserVerifyRequestListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userVerifyRequestListOptions =
        await userVerifyRequestController.baseUserVerifyRequestList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...userVerifyRequestListOptions,
      });
    });

  getAdminSearchedWordListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const searchedWordListOptions =
        await searchedWordController.baseSearchedWordList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...searchedWordListOptions,
      });
    });

  baseGetListingListPageOptions = async (req, res, ownerId = null) => {
    const searchCategories = cloneObject(req.body.categories) ?? [];
    let needSubscriptionNewCategory = false;
    let hasListings = false;

    if (req.body.searchCategory) {
      searchCategories.push(req.body.searchCategory);
    }

    if (searchCategories.length == 1) {
      const foundCategory = await this.listingCategoriesModel.getByName(
        searchCategories[0]
      );

      if (!foundCategory) {
        if (req.userData.userId) {
          const hasNotify =
            await this.listingCategoryCreateNotificationModel.checkUserHasCategoryNotify(
              req.userData.userId,
              searchCategories[0]
            );
          needSubscriptionNewCategory = !hasNotify;
        } else {
          needSubscriptionNewCategory = true;
        }
      }
    }

    if (searchCategories.length != 1 || !needSubscriptionNewCategory) {
      const { countItems } = await listingController.baseCountListings(
        req,
        ownerId
      );
      hasListings = countItems > 0;
    }

    const categories = await this.getNavigationCategories();

    const coords = await coordsByIp(req.body.clientIp ?? null);
    req.body.lat = coords.lat;
    req.body.lng = coords.lng;

    const result = await listingController.baseListingList(req, ownerId);

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      categories,
      needSubscriptionNewCategory,
      hasListings,
      ...result,
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
      const tenantBaseCommissionPercent =
        await this.systemOptionModel.getTenantBaseCommissionPercent();

      if (!listing) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing wasn't found"
        );
      }

      if (userId) {
        listing["blockedDates"] =
          await this.orderModel.getBlockedListingDatesForUser(
            listing.id,
            userId
          );
      } else {
        listing["blockedDates"] = [];
      }

      const categories = await this.getNavigationCategories();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        listing,
        categories,
        tenantBaseCommissionPercent,
      });
    });

  getOrderFullByIdOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const order = await this.orderModel.getFullById(id);

      const commissionInfo = await this.systemOptionModel.getCommissionInfo();

      if (!order) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Order wasn't found"
        );
      }

      const blockedDates = await this.orderModel.getBlockedListingDates(
        order.listingId
      );

      let conflictOrders = null;

      if (userId == order.ownerId) {
        conflictOrders = await this.orderModel.getConflictOrders(
          order.id,
          order.listingId,
          order.offerStartDate,
          order.offerEndDate
        );
      } else {
        order["tenantAcceptListingQrcode"] = null;
      }

      order["actualUpdateRequest"] =
        await this.orderUpdateRequestModel.getActualRequestInfo(order.id);

      order["previousUpdateRequest"] =
        await this.orderUpdateRequestModel.getPreviousRequestInfo(order.id);

      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order,
        categories,
        ...commissionInfo,
        blockedDates,
        conflictOrders,
      });
    });

  getOrderTenantQrCodeInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { token } = req.params;
      const order = await this.orderModel.getFullByTenantListingToken(token);

      if (!order || order.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const commissionInfo = await this.systemOptionModel.getCommissionInfo();

      if (!order) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Order wasn't found"
        );
      }

      const blockedDates = await this.orderModel.getBlockedListingDates(
        order.listingId
      );

      let conflictOrders = null;

      if (userId == order.ownerId) {
        conflictOrders = await this.orderModel.getConflictOrders(
          order.id,
          order.listingId,
          order.offerStartDate,
          order.offerEndDate
        );
      }

      order["actualUpdateRequest"] =
        await this.orderUpdateRequestModel.getActualRequestInfo(order.id);

      order["previousUpdateRequest"] =
        await this.orderUpdateRequestModel.getPreviousRequestInfo(order.id);

      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        order,
        categories,
        ...commissionInfo,
        blockedDates,
        conflictOrders,
        canAcceptTenantListing: true,
        acceptListingTenantToken: token,
      });
    });

  getAdminListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const listingListOptions =
        await listingController.baseListingWithStatusesList(req);
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
      const result = await listingApprovalRequestController.baseRequestsList(
        req,
        userId
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminListingApprovalRequestListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await listingApprovalRequestController.baseRequestsList(
        req
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });

  getAdminListingApprovalRequestPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const request = await this.listingApprovalRequestModel.getById(id);

      if (!request) {
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

  getBookingListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const isForTenant = req.body.type !== "owner";

      const request = isForTenant
        ? orderController.baseTenantBookingList
        : orderController.baseListingOwnerBookingList;

      const result = await request(req);
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
      });
    });

  getAdminBookingListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await orderController.baseAdminBookingList(req);
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
      });
    });

  getOrderListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const isForTenant = req.body.type !== "owner";

      const request = isForTenant
        ? orderController.baseTenantOrderList
        : orderController.baseListingOwnerOrderList;

      const result = await request(req);
      const categories = await this.getNavigationCategories();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
        categories,
      });
    });

  getAdminOrderListOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await orderController.baseAdminOrderList(req);
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

      if (!order) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Order wasn't found"
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  getFullOrderByIdWithRequestsToUpdatePageOption = (req, res) =>
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
}

module.exports = new MainController();
