const STATIC = require("../static");
const Controller = require("./Controller");
const listingCategoriesController = require("./listingCategoriesController");

class SearchedWordController extends Controller {
  constructor() {
    super();
  }

  baseSearchedWordList = async (req) => {
    const { accepted = null, viewed = null } = req.body;

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.searchedWordModel.totalCount(filter, accepted, viewed)
    );

    options["accepted"] = accepted ?? "all";
    options["viewed"] = viewed ?? "all";

    const requests = await this.searchedWordModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseSearchedWordList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      const searchedWord = await this.searchedWordModel.getById(id);
      const groupedCategories =
        await this.listingCategoryModel.listGroupedByLevel();

      if (!searchedWord) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      let createdCategory = null;

      if (searchedWord["listingCategoriesId"]) {
        createdCategory = await this.listingCategoryModel.getById(
          searchedWord["listingCategoriesId"]
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        searchedWord,
        groupedCategories,
        createdCategory,
      });
    });

  tipsList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const searchValue = req.query.search ?? "";
      const list = await this.listingCategoryModel.listByName(searchValue);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        list,
      });
    });

  createCategory = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, level, parentId = null, searchedWordId } = req.body;

      let image = null;

      if (req.file) {
        image = this.moveUploadsFileToFolder(req.file, "listingCategories");
      }

      const createdId = await this.listingCategoryModel.create({
        name,
        level,
        parentId,
        popular: false,
        image,
      });

      await listingCategoriesController.onCreateCategory(name, createdId);

      this.saveUserAction(
        req,
        `Created a listing category by searched request '${name}'`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        id: createdId,
        name,
        level,
        parentId,
        popular: false,
      });
    });
}

module.exports = new SearchedWordController();
