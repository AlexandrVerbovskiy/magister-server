require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Controller = require("./Controller");
const listingController = require("./listingController");

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
      });
    });

  getUserListingListPageOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await listingController.baseListingList(req, userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...result,
      });
    });
}

module.exports = new BaseController();
