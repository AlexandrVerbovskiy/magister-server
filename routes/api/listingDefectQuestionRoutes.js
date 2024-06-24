const { Router } = require("express");
const router = Router();
const { listingDefectQuestionController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

module.exports = (io) => {
  listingDefectQuestionController.bindIo(io);
  
  router.post(
    "/save",
    isAuth,
    isAdmin,
    listingDefectQuestionController.saveList
  );

  return router;
};
