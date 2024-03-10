const { Router } = require("express");
const router = Router();
const { listingCategoriesController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");
const { smallUpload } = require("../../utils");

router.get("/list", listingCategoriesController.list);

router.post(
  "/save",
  isAuth,
  isAdmin,
  smallUpload.any(),
  isSmallFileLimit,
  listingCategoriesController.saveList
);

module.exports = router;
