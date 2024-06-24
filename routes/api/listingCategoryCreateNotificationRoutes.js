const { Router } = require("express");
const router = Router();
const {
  listingCategoryCreateNotificationController,
} = require("../../controllers");
const { isAuth } = require("../../middlewares");
const {
  createValidation,
} = require("../../validations/listingCategoryCreateNotification");

module.exports = (io) => {
  listingCategoryCreateNotificationController.bindIo(io);

  router.post(
    "/create",
    isAuth,
    createValidation,
    listingCategoryCreateNotificationController.create
  );

  return router;
};
