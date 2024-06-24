const { Router } = require("express");
const router = Router();
const { ListingDefectQuestionController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

module.exports = (io) => {
  const listingDefectQuestionController = new ListingDefectQuestionController(
    io
  );

  router.post(
    "/save",
    isAuth,
    isAdmin,
    listingDefectQuestionController.saveList
  );

  return router;
};
