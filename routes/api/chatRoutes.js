const { Router } = require("express");
const { chatController } = require("../../controllers");
const isAuth = require("../../middlewares/isAuth");
const router = Router();

router.post("/chat-list", isAuth, chatController.getChatList);

router.post("/chat-message-list", isAuth, chatController.getChatMessageList)

router.post("/chat-base-info", isAuth, chatController.getChatBaseInfo)

module.exports = router;
