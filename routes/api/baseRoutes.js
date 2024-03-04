const { Router } = require("express");
const router = Router();
const { baseController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/index-options", baseController.getOptionsToIndexPage);
router.get("/create-listing-options", isAuth, baseController.getOptionsToCreateListing);
router.get("/listing-list-options", baseController.getListingListOptions);
module.exports = router;
