const { Router } = require("express");
const { ChatController } = require("../../controllers");
const isAuth = require("../../middlewares/isAuth");
const router = Router();

module.exports = (io) => {
  const chatController = new ChatController(io);

  router.post("/chat-list", isAuth, chatController.getChatList);

  router.post("/chat-message-list", isAuth, chatController.getChatMessageList);

  router.post("/chat-base-info", isAuth, chatController.getChatBaseInfo);

  return router;
};
