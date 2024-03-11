const { Router } = require("express");
const router = Router();
const {
  listingCategoryCreateNotificationController,
} = require("../../controllers");
const { isAuth } = require("../../middlewares");

router.post(
  "/create",
  isAuth,
  listingCategoryCreateNotificationController.create
);

module.exports = router;
