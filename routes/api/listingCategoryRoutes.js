const { Router } = require("express");
const router = Router();
const { listingCategoriesController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/list", listingCategoriesController.list);

router.post("/save", isAuth, isAdmin, listingCategoriesController.saveList);

module.exports = router;
