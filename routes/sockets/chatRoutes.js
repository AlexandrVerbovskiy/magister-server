const { ChatController } = require("../../controllers");
const { validateToken } = require("../../utils");
const { userModel } = require("../../models");

module.exports = (io) => {
  const chatController = new ChatController(io);

  const onConnection = async (socket) => {
    const sendError = (message) => io.to(socket.id).emit("error", message);

    const token = socket.handshake.query.token;
    const resValidate = validateToken(token);
    const userId = resValidate?.userId;

    if (!resValidate || !userId) {
      return sendError("Authentication failed");
    }

    const user = await userModel.getById(userId);

    if (!user) {
      return sendError("Authentication failed");
    }

    await chatController.onConnection(socket.id, userId);

    const bindFuncToEvent = (event, func) => {
      socket.on(event, async (data) => {
        try {
          await func(data, {
            socket,
            userId,
          });
        } catch (e) {
          console.log(e);
          sendError(e.message);
        }
      });
    };

    bindFuncToEvent("send-message", chatController.onSendTextMessage);
    bindFuncToEvent(
      "admin-send-message",
      chatController.onSendTextMessageByAdmin
    );
    bindFuncToEvent("update-message", chatController.onUpdateMessage);
    bindFuncToEvent(
      "admin-update-message",
      chatController.onUpdateMessageByAdmin
    );
    bindFuncToEvent("delete-message", chatController.onDeleteMessage);
    bindFuncToEvent(
      "admin-delete-message",
      chatController.onDeleteMessageByAdmin
    );

    bindFuncToEvent("start-typing", chatController.onStartTyping);
    //bindFuncToEvent("admin-start-typing", chatController.onStartTyping);
    bindFuncToEvent("end-typing", chatController.onFinishTyping);
    //bindFuncToEvent("admin-end-typing", chatController.onFinishTyping);

    bindFuncToEvent("file-part-upload", chatController.onFilePartUpload);
    bindFuncToEvent(
      "admin-file-part-upload",
      chatController.onFilePartUploadByAdmin
    );
    bindFuncToEvent("stop-file-upload", chatController.onStopFileUpload);
    bindFuncToEvent("admin-stop-file-upload", chatController.onStopFileUpload);

    bindFuncToEvent("disconnect", chatController.onDisconnect);
    bindFuncToEvent("stop-actions", chatController.onStopEvents);
    bindFuncToEvent("admin-stop-actions", chatController.onStopEvents);
  };

  io.on("connection", onConnection);
};
