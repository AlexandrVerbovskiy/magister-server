const { Router } = require("express");
const { ChatController } = require("../../controllers");
const { isAuth, isAdmin } = require("../../middlewares");
const {
  baseChatInfoValidation,
  chatListValidation,
  chatMessageListValidation,
} = require("../../validations/chat");
const router = Router();

module.exports = (io) => {
  const chatController = new ChatController(io);

  router.post(
    "/chat-list",
    isAuth,
    chatListValidation,
    chatController.getChatList
  );

  router.post(
    "/chat-message-list",
    isAuth,
    chatMessageListValidation,
    chatController.getChatMessageList
  );

  router.post(
    "/chat-base-info",
    isAuth,
    baseChatInfoValidation,
    chatController.getChatInfoByUser
  );

  router.post(
    "/admin-chat-list",
    isAuth,
    isAdmin,
    chatController.getChatListForAdmin
  );

  router.post(
    "/admin-chat-message-list",
    isAuth,
    isAdmin,
    chatController.getChatMessageListForAdmin
  );

  router.post(
    "/admin-chat-base-info",
    isAuth,
    isAdmin,
    chatController.getChatInfoByAdmin
  );

  return router;
};
