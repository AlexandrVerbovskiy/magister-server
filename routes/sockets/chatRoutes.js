const { chatController } = require("../../controllers");
const { validateToken } = require("../../utils");

module.exports = (io) => {
  chatController.bindIo(io);

  const onConnection = async (socket) => {
    const sendError = (message) => io.to(socket.id).emit("error", message);

    const token = socket.handshake.query.token;
    const resValidate = validateToken(token);
    const userId = resValidate.userId;

    if (!userId) {
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
          sendError(e.message);
        }
      });
    };

    bindFuncToEvent("disconnect", chatController.onDisconnect);
  };

  io.on("connection", onConnection);
};
