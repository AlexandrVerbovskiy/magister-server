const { Router } = require("express");
const router = Router();
const { searchedWordController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.post("/list", isAuth, isAdmin, searchedWordController.list);
router.post(
  "/create-category",
  isAuth,
  isAdmin,
  searchedWordController.createCategory
);

router.get("/get-by-id/:id", isAuth, isAdmin, searchedWordController.getById);
router.get("/tips-list", searchedWordController.tipsList);
router.get("/search", searchedWordController.search);

module.exports = router;
