const { Router } = require("express");
const router = Router();
const { searchedWordController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");
const {
  listValidation,
  createCategoryValidation,
  idValidation,
  tipsListValidation,
} = require("../../validations/searchedWord");

router.post(
  "/list",
  isAuth,
  isAdmin,
  listValidation,
  searchedWordController.list
);
router.post(
  "/create-category",
  isAuth,
  isAdmin,
  createCategoryValidation,
  searchedWordController.createCategory
);

router.get(
  "/get-by-id/:id",
  isAuth,
  isAdmin,
  idValidation,
  searchedWordController.getById
);
router.get("/tips-list", tipsListValidation, searchedWordController.tipsList);

module.exports = router;
