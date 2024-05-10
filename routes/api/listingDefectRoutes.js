const { Router } = require("express");
const router = Router();
const { listingDefectController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

router.post("/save", isAuth, isAdmin, listingDefectController.saveList);

module.exports = router;
