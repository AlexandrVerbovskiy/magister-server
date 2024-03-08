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

class BaseController extends Controller {
  getIndexPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const popularCategories = await this.listingCategoriesModel.popularList();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        popularCategories,
      });
    });

  getListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoriesModel.listGroupedByLevel();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getCreateListingPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoriesModel.listGroupedByLevel();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getUpdateListingPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const id = req.params.id;
      const userId = req.userData.userId;
      const listing = await this.listingModel.getById(id);

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

      const categories = await this.listingCategoriesModel.listGroupedByLevel();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
        listing,
        lastRequestInfo,
      });
    });

  getUserListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await listingController.baseListingWithStatusesList(
        req,
        userId
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
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

  getMainListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const listingListOptions = await listingController.baseListingList(req);
      const categories = await this.listingCategoriesModel.listGroupedByLevel();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...listingListOptions,
        categories,
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

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        documents,
        canSend: !hasUnansweredRequest,
        lastAnswerDescription,
      });
    });

  getAdminListingCreatePageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoriesModel.listGroupedByLevel();

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

      const categories = await this.listingCategoriesModel.listGroupedByLevel();

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
}

module.exports = new BaseController();
