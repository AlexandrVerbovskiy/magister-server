const { Router } = require("express");
const router = Router();
const { SearchedWordController } = require("../../controllers");
const { isAuth, isAdmin, isSmallFileLimit } = require("../../middlewares");
const {
  listValidation,
  createCategoryValidation,
  idValidation,
  tipsListValidation,
} = require("../../validations/searchedWord");
const { smallImageUpload } = require("../../utils");

module.exports = (io) => {
  const searchedWordController = new SearchedWordController(io);

  router.post(
    "/list",
    isAuth,
    isAdmin,
    listValidation,
    searchedWordController.list
  );

  router.post(
    "/create-category",
    smallImageUpload.single("photo"),
    isSmallFileLimit,
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

  return router;
};
