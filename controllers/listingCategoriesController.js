const STATIC = require("../static");
const BaseController = require("./baseController");
const lodash = require("lodash");

class ListingCategoriesController extends BaseController {
  getList = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const groupedList =
        await this.listingCategoriesModel.listGroupedByLevel();
      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        null,
        groupedList
      );
    });
  };

  findCategoryByName = (categories, name) => {
    let res = null;

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        if (category.name == name) {
          res = category;
        }
      });
    });

    return res;
  };

  getNumberLevelByName = (level) => {
    let numberLevel = 3;
    if (level == "firstLevel") numberLevel = 1;
    if (level == "secondLevel") numberLevel = 2;
    return numberLevel;
  };

  saveList = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const listToSave = req.body;

      const groupedList =
        await this.listingCategoriesModel.listGroupedByLevel();

      const toDelete = { firstLevel: [], secondLevel: [], thirdLevel: [] };
      const toCreate = { firstLevel: [], secondLevel: [], thirdLevel: [] };
      const toUpdate = { firstLevel: [], secondLevel: [], thirdLevel: [] };

      const levels = ["firstLevel", "secondLevel", "thirdLevel"];

      for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        const level = levels[levelIndex];
        const numberLevel = this.getNumberLevelByName(level);
        const categoriesToSaveLevel = listToSave[level];
        const categoriesCurrentLevel = groupedList[level];

        const categoriesToSaveLevelIds = categoriesToSaveLevel.map(
          (category) => category.id
        );

        const categoriesCurrentLevelIds = categoriesCurrentLevel.map(
          (category) => category.id
        );

        categoriesCurrentLevel
          .filter((category) => !categoriesToSaveLevelIds.includes(category.id))
          .forEach((category) => toDelete[level].push(category));

        const categoriesToCreate = categoriesToSaveLevel.filter(
          (category) => !category.id
        );

        for (let categoryIndex in categoriesToCreate) {
          const category = categoriesToCreate[categoryIndex];

          const unique = this.listingCategoriesModel.checkNameUnique(
            category.name,
            numberLevel
          );

          if (!unique) {
            let inDelete = false;

            toDelete[level].forEach((categoryToDelete) => {
              if (categoryToDelete.name == category.name) {
                inDelete = true;
              }
            });

            if (!inDelete) {
              return this.sendErrorResponse(
                res,
                STATIC.ERRORS.INVALID_KEY_DATA,
                `Category ${category.name} at level ${category.level} created before`
              );
            }
          }

          toCreate[level].push({ ...category, level: numberLevel });
        }

        categoriesCurrentLevelIds.forEach((categoryId) => {
          const currentCategoryData = categoriesCurrentLevel.filter(
            (category) => category.id == categoryId
          )[0];

          const savingCategoryData = categoriesToSaveLevel.filter(
            (category) => category.id == categoryId
          )[0];

          if (!savingCategoryData || !currentCategoryData) {
            return;
          }

          const savingCategoryDataToCompare = { ...savingCategoryData };
          delete savingCategoryDataToCompare["parentName"];
          delete currentCategoryData["parentName"];

          if (
            !lodash.isEqual(savingCategoryDataToCompare, currentCategoryData)
          ) {
            toUpdate[level].push({ ...savingCategoryData, level: numberLevel });
          }
        });
      }

      levels.forEach((level) => {
        const numberLevel = this.getNumberLevelByName(level);
        const ids = toDelete[level].map((category) => category.id);
        this.listingCategoriesModel.deleteList(ids, numberLevel);
      });

      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];

        for (let index = 0; index < toCreate[level].length; index++) {
          const elem = toCreate[level][index];

          if (!elem["parentId"] && level !== "firstLevel") {
            const created = this.findCategoryByName(
              toCreate,
              elem["parentName"]
            );
            elem["parentId"] = created["id"];
          }

          const id = await this.listingCategoriesModel.create(elem);
          toCreate[level][index]["id"] = id;
        }
      }

      Object.keys(toUpdate).forEach((level) => {
        toUpdate[level].forEach((elem, index) => {
          if (!toCreate[level][index]["parentId"] && level !== "firstLevel") {
            const created = this.findCategoryByName(
              toCreate,
              elem["parentName"]
            );
            elem["parentId"] = created["id"];
          }

          this.listingCategoriesModel.update(elem);
        });
      });

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "List saved successfully"
      );
    });
  };
}

module.exports = new ListingCategoriesController();
