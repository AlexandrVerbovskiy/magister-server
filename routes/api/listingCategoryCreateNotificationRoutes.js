const { Router } = require("express");
const router = Router();
const {
  listingCategoryCreateNotificationController,
} = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {createValidation} = require("../../validations/listingCategoryCreateNotification");

router.post(
  "/create",
  isAuth,
  createValidation,
  listingCategoryCreateNotificationController.create
);

module.exports = router;
