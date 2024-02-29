const STATIC = require("../static");
const Controller = require("./Controller");

class SearchedWordController extends Controller {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { accepted, viewed } = req.body;

      const { options, countItems } = await this.baseList(req, ({ filter }) =>
        this.searchedWordModel.totalCount(filter, accepted, viewed)
      );

      options["accepted"] = accepted ?? "all";
      options["viewed"] = viewed ?? "all";

      const requests = await this.searchedWordModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: requests,
        options,
        countItems,
      });
    });
  };

  getById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      if (isNaN(id)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const searchedWord = await this.searchedWordModel.getById(id);
      const groupedCategories =
        await this.listingCategoriesModel.listGroupedByLevel();

      if (!searchedWord) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      let createdCategory = null;

      if (searchedWord["listingCategoriesId"]) {
        createdCategory = await this.listingCategoriesModel.getById(
          searchedWord["listingCategoriesId"]
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        searchedWord,
        groupedCategories,
        createdCategory,
      });
    });

  tipsList = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const searchValue = req.query.search;
      const list = await this.listingCategoriesModel.listByName(searchValue);

      if (list.length < 1) {
        this.searchedWordModel.updateSearchCount(searchValue);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        list,
      });
    });
  };

  search = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const searchValue = req.query.search;
    });
  };

  createCategory = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { name, level, parentId, searchedWordId } = req.body;
      const createdId = await this.listingCategoriesModel.create({
        name,
        level,
        parentId,
        popular: false,
      });

      await this.searchedWordModel.setCategoryId(searchedWordId, createdId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        id: createdId,
        name,
        level,
        parentId,
        popular: false,
      });
    });
  };
}

module.exports = new SearchedWordController();
