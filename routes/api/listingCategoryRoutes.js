const { Router } = require("express");
const router = Router();
const { ListingCategoriesController } = require("../../controllers");
const {
  isAuth,
  isAdmin,
  isSmallFileLimit,
  isSummaryFileLimit,
} = require("../../middlewares");
const { smallUpload } = require("../../utils");
const {
  saveValidation,
  createByOthersValidation,
  othersListValidation,
} = require("../../validations/listingCategory");

module.exports = (io) => {
  const listingCategoriesController = new ListingCategoriesController(io);

  router.get("/list", listingCategoriesController.list);

  router.post(
    "/save",
    isAuth,
    isAdmin,
    smallUpload.any(),
    isSummaryFileLimit,
    isSmallFileLimit,
    saveValidation,
    listingCategoriesController.saveList
  );

  router.post(
    "/create-by-others",
    smallUpload.single("photo"),
    isSmallFileLimit,
    isAuth,
    isAdmin,
    createByOthersValidation,
    listingCategoriesController.createByOthersCategory
  );

  router.post(
    "/admin-searched-others-categories-list",
    isAuth,
    isAdmin,
    othersListValidation,
    listingCategoriesController.getOtherCategories
  );

  return router;
};
