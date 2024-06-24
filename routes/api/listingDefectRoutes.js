const { Router } = require("express");
const router = Router();
const { ListingDefectController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

module.exports = (io) => {
  const listingDefectController = new ListingDefectController(io);
  router.post("/save", isAuth, isAdmin, listingDefectController.saveList);
  return router;
};
