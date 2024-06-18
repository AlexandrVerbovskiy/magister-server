const STATIC = require("../static");
const Controller = require("./Controller");

class ChatController extends Controller {
  io = null;

  bindIo(io) {
    this.io = io;
  }

  onConnection = async (socket, userId) => {
    await this.socketModel.connect(socket, userId);
    await this.userModel.updateOnline(userId, true);
  };

  onDisconnect = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const socket = sessionInfo.socket;

    console.log("disconnected");

    await this.userModel.updateOnline(userId, false);
    await this.socketModel.disconnect(socket);
  };
}

module.exports = new ChatController();
