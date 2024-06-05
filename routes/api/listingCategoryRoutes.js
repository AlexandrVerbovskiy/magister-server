const { Router } = require("express");
const router = Router();
const { listingCategoriesController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit, isSummaryFileLimit } = require("../../middlewares");
const { smallUpload } = require("../../utils");
const { saveValidation } = require("../../validations/listingCategory");

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

module.exports = router;
