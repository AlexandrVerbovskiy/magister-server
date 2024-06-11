const { Router } = require("express");
const router = Router();
const { disputeController } = require("../../controllers");
const { isAuth, isSupport } = require("../../middlewares");

router.post("/list", isAuth, isSupport, disputeController.list);

router.post("/create", isAuth, disputeController.create);

router.post("/solve", isAuth, isSupport, disputeController.solve);

router.post("/unsolve", isAuth, isSupport, disputeController.unsolve);

module.exports = router;