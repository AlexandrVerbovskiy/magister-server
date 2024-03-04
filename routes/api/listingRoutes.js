const { Router } = require("express");
const router = Router();
const { listingController } = require("../../controllers");
const { isAuth, isAdmin, isFileLimit } = require("../../middlewares");
const { upload } = require("../../utils");

router.get("/list", listingController.getList);
router.get("/get-short-by-id/{id}", listingController.getShortById);
router.get("/get-full-by-id/{id}", listingController.getFullById);
router.post(
  "/create",
  upload.any(),
  isFileLimit,
  isAuth,
  listingController.create
);
router.post("/update", isAuth, listingController.update);
router.post("/delete", isAuth, listingController.delete);
router.post(
  "/update-by-admin",
  isAuth,
  isAdmin,
  upload.any(),
  isFileLimit,

  listingController.updateByAdmin
);
router.post(
  "/delete-by-admin",
  isAuth,
  isAdmin,
  listingController.deleteByAdmin
);

module.exports = router;
