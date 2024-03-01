const { Router } = require("express");
const router = Router();
const { baseController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/index-options", baseController.getOptionsToIndexPage);
router.get("/create-listing-options", isAuth, baseController.getOptionsToCreateListing);

module.exports = router;
