const { Router } = require("express");
const router = Router();
const { recipientPaymentController } = require("../../controllers");
const { isAuth } = require("../../middlewares");

router.post("/list", isAuth, recipientPaymentController.list);

module.exports = router;
