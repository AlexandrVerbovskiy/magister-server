const { Router } = require("express");
const router = Router();
const { baseController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/index-options", baseController.getIndexPageOptions);

router.get("/listing-list-options", baseController.getListingListPageOptions);

router.get(
  "/create-listing-options",
  isAuth,
  baseController.getCreateListingPageOptions
);

router.get(
  "/update-listing-options/:id",
  isAuth,
  baseController.getUpdateListingPageOptions
);

router.post(
  "/user-listing-list-options",
  isAuth,
  baseController.getUserListingListPageOptions
);

module.exports = router;
