const STATIC = require("../static");
const { removeDuplicates } = require("../utils");
const Controller = require("./Controller");
const lodash = require("lodash");

class ListingCategoriesController extends Controller {
  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const groupedList = await this.listingCategoryModel.listGroupedByLevel();
      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        null,
        groupedList
      );
    });

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

  getFileLevelAndIndex = (fileFieldName) => {
    const match = fileFieldName.match(/\[([^\[\]]+)\]\[(\d+)\]/);
    const level = match[1];
    const index = parseInt(match[2]);
    return { level, index };
  };

  onCreateCategory = async (categoryName, categoryId) => {
    const notificationInfos =
      await this.listingCategoryCreateNotificationModel.getForCategoryName(
        categoryName
      );

    await this.searchedWordModel.setCategoryByName(categoryName, categoryId);

    const toDeleteIds = notificationInfos.map((info) => info.id);
    const toSentMessageEmails = removeDuplicates(
      notificationInfos.map((info) => info.userEmail)
    );

    toSentMessageEmails.forEach((email) =>
      this.sendCreatedListingCategory(email, categoryName)
    );

    await this.listingCategoryCreateNotificationModel.deleteList(toDeleteIds);
  };

  saveList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const levels = ["firstLevel", "secondLevel", "thirdLevel"];

      const categoriesToSave = {
        firstLevel: [],
        secondLevel: [],
        thirdLevel: [],
        ...req.body.categoriesToSave,
      };

      const categoriesToReplace = req.body.categoriesToReplace ?? [];

      Object.keys(categoriesToSave).forEach((level) => {
        categoriesToSave[level].forEach((elem, index) => {
          categoriesToSave[level][index] = { ...elem };

          if (elem.id) {
            categoriesToSave[level][index]["id"] = Number(elem.id);
          }

          if (elem.parentId) {
            categoriesToSave[level][index]["parentId"] = Number(elem.parentId);
          }

          if (elem.level) {
            categoriesToSave[level][index]["level"] = Number(elem.level);
          }

          if (elem.popular) {
            categoriesToSave[level][index]["popular"] = true;
          }
        });
      });

      const listToSave = { ...categoriesToSave };

      const folder = "listingCategories";

      req.files.forEach((file) => {
        const filePath = this.moveUploadsFileToFolder(file, folder);

        const { level, index } = this.getFileLevelAndIndex(file.fieldname);
        listToSave[level][index]["image"] = filePath;
        categoriesToSave[level][index]["image"] = filePath;
      });

      const groupedList = await this.listingCategoryModel.listGroupedByLevel();

      const toDelete = { firstLevel: [], secondLevel: [], thirdLevel: [] };
      const toCreate = { firstLevel: [], secondLevel: [], thirdLevel: [] };
      const toUpdate = { firstLevel: [], secondLevel: [], thirdLevel: [] };

      const filesToDelete = [];

      for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        const level = levels[levelIndex];
        const numberLevel = this.getNumberLevelByName(level);
        const categoriesToSaveLevel = listToSave[level] ?? [];
        const categoriesCurrentLevel = groupedList[level] ?? [];

        const categoriesToSaveLevelIds = categoriesToSaveLevel.map(
          (category) => category.id
        );

        const categoriesCurrentLevelIds = categoriesCurrentLevel.map(
          (category) => category.id
        );

        categoriesCurrentLevel
          .filter(
            (category) =>
              category.id && !categoriesToSaveLevelIds.includes(category.id)
          )
          .forEach((category) => {
            toDelete[level].push(category);
          });

        const categoriesToCreate = categoriesToSaveLevel.filter(
          (category) => !category.id
        );

        for (let categoryIndex in categoriesToCreate) {
          const category = categoriesToCreate[categoryIndex];

          const unique = this.listingCategoryModel.checkNameUnique(
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

          toCreate[level].unshift({ ...category, level: numberLevel });
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

            if (
              currentCategoryData.image &&
              currentCategoryData.image != savingCategoryData.image
            ) {
              filesToDelete.push(currentCategoryData.image);
            }
          }
        });
      }

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

          const id = await this.listingCategoryModel.create(elem);
          toCreate[level][index]["id"] = id;
        }
      }

      categoriesToReplace.forEach((categoryToReplace, index) => {
        Object.keys(toCreate).forEach((level) => {
          toCreate[level].forEach((createdCategory) => {
            const levelNumber = this.getNumberLevelByName(level);
            if (
              categoryToReplace.newLevel == levelNumber &&
              categoryToReplace.newName == createdCategory.name
            ) {
              categoriesToReplace[index]["newId"] = createdCategory.id;
            }
          });
        });
      });

      await this.listingModel.replaceOldNewCategories(categoriesToReplace);

      levels.forEach(async (level) => {
        const ids = toDelete[level].map((category) => category.id);
        await this.searchedWordModel.unsetCategoryList(ids);
        await this.listingCategoryModel.deleteList(ids);
      });

      Object.keys(toUpdate).forEach((level) => {
        toUpdate[level].forEach((elem, index) => {
          if (!toUpdate[level][index]["parentId"] && level !== "firstLevel") {
            const created = this.findCategoryByName(
              toCreate,
              elem["parentName"]
            );
            elem["parentId"] = created["id"];
          }

          this.listingCategoryModel.update(elem);
        });
      });

      const resList = { ...categoriesToSave };

      levels.forEach((level) => {
        resList[level].forEach((elem, index) => {
          if (!elem.id) {
            const created = this.findCategoryByName(toCreate, elem["name"]);
            resList[level][index]["id"] = created["id"];
          }

          if (!elem.parentId && elem.parentName) {
            const created = this.findCategoryByName(
              toCreate,
              elem["parentName"]
            );
            resList[level][index]["parentId"] = created["id"];
          }
        });
      });

      filesToDelete.forEach((file) => this.removeFile(file));

      this.saveUserAction(req, `Update listing category list`);

      levels.forEach((level) => {
        const newCategories = [];

        [...toCreate[level], ...toUpdate[level]].forEach((category) => {
          this.onCreateCategory(category.name, category.id);
          newCategories.push({ name: category.name, id: category.id });
        });

        newCategories.forEach((info) =>
          this.searchedWordModel.setCategoryByName(info.name, info.id)
        );
      });

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "List saved successfully",
        resList
      );
    });
}

module.exports = ListingCategoriesController;
