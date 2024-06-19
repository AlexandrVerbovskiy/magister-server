const { Router } = require("express");
const { chatController } = require("../../controllers");
const isAuth = require("../../middlewares/isAuth");
const router = Router();

router.post("/chat-list", isAuth, chatController.getChatList);

module.exports = router;
