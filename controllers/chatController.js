const STATIC = require("../static");
const {
  indicateMediaTypeByExtension,
  generateRandomString,
} = require("../utils");
const Controller = require("./Controller");
const fs = require("fs");

class ChatController extends Controller {
  message_files_dir = "public/messages";

  userChatRelationSendMessage = async (userId, messageKey) => {
    const relations = await this.chatModel.getUserChatsOpponentSockets(userId);

    relations.forEach((relation) =>
      this.io.to(relation.socket).emit(messageKey, { chatId: relation.chatId })
    );
  };

  onConnection = async (socket, userId) => {
    await this.socketModel.connect(socket, userId);
    await this.userModel.updateOnline(userId, true);
    await this.userChatRelationSendMessage(userId, "opponent-online");
  };

  onDisconnect = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const socket = sessionInfo.socket;

    await this.userModel.updateOnline(userId, false);
    await this.socketModel.disconnect(socket);
    await this.stopAllUserActions(userId);

    await this.userChatRelationSendMessage(userId, "opponent-offline");
  };

  baseGetChatList = async (req, res) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;
    const chatType = req.body.chatType ?? "orders";
    const chatFilter = req.body.chatFilter ?? "";
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
      chatFilter,
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

  baseGetChatMessageList = async (req, res) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;
    let count = req.body.count ?? 50;
    const lastMessageId = req.body.lastMessageId ?? null;

    if (count > 250) {
      count = 250;
    }

    const messageList = await this.chatMessageModel.getList({
      chatId,
      count,
      lastMessageId,
    });

    const lastMessage = messageList[messageList.length - 1];

    let canShowMore = false;

    if (lastMessage) {
      canShowMore = await this.chatMessageModel.checkHasMore({
        lastMessageId: lastMessage.id,
        chatId,
      });
    }

    return {
      error: null,
      list: messageList,
      canShowMore,
      options: {},
    };
  };

  getChatMessageList = async (req, res) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;

    const userHasChatAccess = await this.chatRelationModel.checkUserHasRelation(
      chatId,
      userId
    );

    if (!userHasChatAccess) {
      return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
    }

    const messagesRes = await this.baseGetChatMessageList(req, res);

    if (messagesRes.error) {
      return this.sendErrorResponse(res, chatRes.error);
    }

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      messages: messagesRes.list,
      messagesCanShowMore: messagesRes.canShowMore,
      options: messagesRes.options,
    });
  };

  sendSocketMessageToUserOpponent = async (
    chatId,
    userId,
    messageKey,
    message
  ) => {
    const sockets = await this.chatModel.getChatOpponentSockets(chatId, userId);
    sockets.forEach((socket) =>
      this.sendSocketIoMessage(socket, messageKey, message)
    );
  };

  onSendTextMessage = async (data, sessionInfo) => {
    const senderId = sessionInfo.userId;
    const chatId = data.chatId;

    const message = await this.chatMessageModel.createTextMessage({
      chatId,
      isAdminSender: false,
      senderId,
      text: data.text,
    });

    await this.sendSocketMessageToUserOpponent(
      chatId,
      senderId,
      "get-message",
      {
        message,
      }
    );

    return this.sendSocketMessageToUser(senderId, "success-sended-message", {
      message,
      tempKey: data.tempKey,
    });
  };

  onChangeTyping = async (data, sessionInfo, typing) => {
    const userId = sessionInfo.userId;
    const chatId = data.chatId;

    if (typing) {
      await this.chatRelationModel.startTyping(chatId, userId);
    } else {
      await this.chatRelationModel.finishTyping(chatId, userId);
    }

    return await this.sendSocketMessageToUserOpponent(
      chatId,
      userId,
      typing ? "start-typing" : "finish-typing",
      {
        chatId,
      }
    );
  };

  onStartTyping = async (data, sessionInfo) =>
    this.onChangeTyping(data, sessionInfo, true);

  onFinishTyping = async (data, sessionInfo) =>
    this.onChangeTyping(data, sessionInfo, false);

  uploadToFile = async ({ userId, tempKey, data, filetype, filename }) => {
    const info = await this.activeActionModel.getByKeyAndType(
      tempKey,
      "sending_file"
    );
    let path =
      this.message_files_dir + "/" + generateRandomString() + "." + filetype;

    if (!info || !info.data) {
      this.createFolderIfNotExists(this.message_files_dir);

      fs.writeFileSync(path, data);
      const actionInfo = JSON.stringify({
        path,
        filename,
      });
      await this.activeActionModel.create(
        userId,
        "sending_file",
        tempKey,
        actionInfo
      );
    } else {
      const resParsed = JSON.parse(info.data);
      path = resParsed.path;
      fs.appendFileSync(path, data);
    }

    return path;
  };

  onFilePartUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;

    const { chatId, tempKey, data: fileBody, filetype, filename, last } = data;

    const path = await this.uploadToFile({
      userId,
      tempKey,
      data: fileBody,
      filetype,
      filename,
    });

    if (!last) {
      return this.sendSocketMessageToUser(userId, "file-part-uploaded", {
        tempKey,
      });
    }

    const message = await this.chatMessageModel.createFileMessage({
      chatId,
      type: indicateMediaTypeByExtension(filetype),
      isAdminSender: false,
      senderId: userId,
      content: { path, filename },
    });

    await this.activeActionModel.deleteByKeyAndType(userId, tempKey);

    await this.sendSocketMessageToUserOpponent(chatId, userId, "get-message", {
      message,
    });

    this.sendSocketMessageToUser(userId, "file-part-uploaded", {
      tempKey,
      message,
    });
  };

  deleteFileAction = async (key) =>
    await this.activeActionModel.deleteByKeyAndType(key, "sending_file");

  onStopFile = async (key) => {
    const info = await this.activeActionModel.getByKeyAndType(
      key,
      "sending_file"
    );

    const { path } = JSON.parse(info.data);
    fs.unlinkSync(path);

    await this.deleteFileAction(key);
  };

  stopAllUserActions = async (userId) => {
    const actions = await this.activeActionModel.getUserActions(userId);

    actions.forEach(async (action) => {
      if (action.type == "sending_file") {
        const key = action.key;
        const info = action.data;
        const { path } = JSON.parse(info);

        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }

        await this.deleteFileAction(key);
      }
    });
  };

  onStopFileUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const tempKey = data.tempKey;

    await this.onStopFile(tempKey);

    return this.sendSocketMessageToUser(userId, "message-cancelled", {
      tempKey,
    });
  };
}

module.exports = new ChatController();
