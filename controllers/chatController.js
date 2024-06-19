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

  baseGetChatList = async (req, res) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;
    const chatType = req.body.chatType ?? "orders";
    let count = req.body.count ?? 20;
    const lastChatId = req.body.lastChatId ?? null;

    if (count > 100) {
      count = 100;
    }

    if (chatId) {
      const userHasChatAccess =
        await this.chatRelationModel.checkUserHasRelation(chatId, userId);

      if (!userHasChatAccess) {
        return { error: STATIC.ERRORS.NOT_FOUND };
      }
    }

    const chatList = await this.chatModel.getList({
      needChatId: chatId,
      chatType,
      userId,
      count,
      lastChatId,
    });

    const lastChat = chatList[chatList.length - 1];

    let canShowMore = false;

    if (lastChat) {
      canShowMore = await this.chatModel.checkHasMore({
        lastChatId: lastChat.id,
        chatType,
        userId,
      });
    }

    return {
      error: null,
      list: chatList,
      canShowMore,
      options: {
        chatType,
      },
    };
  };

  getChatList = async (req, res) => {
    const chatRes = await this.baseGetChatList(req, res);

    if (chatRes.error) {
      return this.sendErrorResponse(res, chatRes.error);
    }

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      chats: chatRes.list,
      chatsCanShowMore: chatRes.canShowMore,
      options: chatRes.options,
    });
  };
}

module.exports = new ChatController();
