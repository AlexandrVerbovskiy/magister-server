const { Router } = require("express");
const router = Router();
const { listingController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");

router.get("/list", listingController.getList);
router.get("/get-short-by-id/{id}", listingController.getShortById);
router.get("/get-full-by-id/{id}", listingController.getFullById);
router.post("/create", isAuth, listingController.getShortById);
router.post("/update", isAuth, listingController.update);
router.post("/delete", isAuth, listingController.delete);
router.post(
  "/update-by-admin",
  isAuth,
  isAdmin,
  listingController.updateByAdmin
);
router.post(
  "/delete-by-admin",
  isAuth,
  isAdmin,
  listingController.deleteByAdmin
);

module.exports = router;
