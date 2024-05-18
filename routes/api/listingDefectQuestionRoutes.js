const { Router } = require("express");
const router = Router();
const { listingDefectQuestionController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");

router.post("/save", isAuth, isAdmin, listingDefectQuestionController.saveList);

module.exports = router;
