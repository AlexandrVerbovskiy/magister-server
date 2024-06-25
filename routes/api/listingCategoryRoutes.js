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
const { saveValidation } = require("../../validations/listingCategory");

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

  return router;
};
