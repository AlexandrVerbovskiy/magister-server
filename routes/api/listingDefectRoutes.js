const { Router } = require("express");
const router = Router();
const { listingDefectController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

module.exports = (io) => {
  listingDefectController.bindIo(io);
  router.post("/save", isAuth, isAdmin, listingDefectController.saveList);
  return router;
};
