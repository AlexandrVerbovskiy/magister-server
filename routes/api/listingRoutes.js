const { Router } = require("express");
const router = Router();
const { listingController } = require("../../controllers");
const { isAuth, isAdmin, isFileLimit } = require("../../middlewares");
const { upload } = require("../../utils");

router.post("/list", listingController.list);
router.post("/admin-list", isAuth, isAdmin, listingController.adminList);
router.post("/change-approve", isAuth, isAdmin, listingController.changeApprove);

router.get("/get-short-by-id/:id", listingController.getShortById);
router.get("/get-full-by-id/:id", listingController.getFullById);

router.post(
  "/create",
  upload.any(),
  isFileLimit,
  isAuth,
  listingController.create
);

router.post(
  "/update",
  upload.any(),
  isFileLimit,
  isAuth,
  listingController.update
);

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

router.post("/list", listingController.getCurrentUserList);

router.post("/user-list", isAuth, listingController.getCurrentUserList);

module.exports = router;
