require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Controller = require("./Controller");

class BaseController extends Controller {
  getOptionsToCreateListing = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const categories = await this.listingCategoriesModel.listGroupedByLevel();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        categories,
      });
    });

  getOptionsToIndexPage = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const popularCategories = await this.listingCategoriesModel.popularList();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        popularCategories,
      });
    });
}

module.exports = new BaseController();
