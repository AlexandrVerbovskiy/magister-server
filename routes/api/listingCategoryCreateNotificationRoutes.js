const { Router } = require("express");
const router = Router();
const {
  ListingCategoryCreateNotificationController,
} = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {
  createValidation,
} = require("../../validations/listingCategoryCreateNotification");

module.exports = (io) => {
  const listingCategoryCreateNotificationController = new ListingCategoryCreateNotificationController(io);

  router.post(
    "/create",
    isAuth,
    createValidation,
    listingCategoryCreateNotificationController.create
  );

  return router;
};
