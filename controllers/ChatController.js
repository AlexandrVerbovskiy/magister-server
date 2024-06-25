const STATIC = require("../static");
const {
  indicateMediaTypeByExtension,
  generateRandomString,
} = require("../utils");
const Controller = require("./Controller");
const fs = require("fs");
const OrderController = require("./OrderController");

class ChatController extends Controller {
  message_files_dir = "public/messages";
  count_message_per_iteration = 50;
  count_chat_per_iteration = 20;

  constructor(io) {
    super(io);
    this.orderController = new OrderController(io);
  }

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
    const count = this.count_chat_per_iteration;
    const lastChatId = req.body.lastChatId ?? null;

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
        lastMessageCreatedTime: lastChat.messageCreatedAt,
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
    const count = this.count_message_per_iteration;
    const lastMessageId = req.body.lastMessageId ?? null;

    const messageList = await this.chatMessageModel.getList({
      chatId,
      count,
      lastMessageId,
    });

    const lastMessage = messageList[messageList.length - 1];

    let canShowMore = false;

    if (lastMessage) {
      canShowMore = await this.chatMessageModel.checkHasMore({
        messageCreatedAt: lastMessage.createdAt,
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

  baseGetChatEntityInfo = async (chatId, userId) => {
    const chat = await this.chatModel.getById(chatId);

    let entity = null;
    const dopEntityInfo = {};

    if (chat.entityType === STATIC.CHAT_TYPES.DISPUTE) {
      entity = await this.disputeModel.getById(chat.entityId);
    } else {
      entity = await this.orderModel.getFullById(chat.entityId);
      entity["childrenList"] = await this.orderModel.getChildrenList(
        chat.entityId
      );

      dopEntityInfo["tenantBaseCommission"] =
        await this.systemOptionModel.getTenantBaseCommissionPercent();
      dopEntityInfo["bankInfo"] =
        await this.systemOptionModel.getBankAccountInfo();

      entity = await this.orderController.wrapOrderFullInfo(entity, userId);
    }

    entity["type"] = chat.entityType;

    return { entity, dopEntityInfo };
  };

  getChatBaseInfo = async (req, res) => {
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

    const { entity, dopEntityInfo } = await this.baseGetChatEntityInfo(
      chatId,
      userId
    );

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      messages: messagesRes.list,
      messagesCanShowMore: messagesRes.canShowMore,
      options: messagesRes.options,
      entity,
      dopEntityInfo,
    });
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

    const sender = await this.userModel.getById(senderId);
    const getter = await this.chatModel.getChatOpponent(chatId, senderId);

    await this.sendSocketMessageToUserOpponent(
      chatId,
      senderId,
      "get-message",
      {
        message,
        opponent: sender,
      }
    );

    return await this.sendSocketMessageToUser(
      senderId,
      "success-sended-message",
      {
        message,
        tempKey: data.tempKey,
        opponent: getter,
      }
    );
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
      return await this.sendSocketMessageToUser(userId, "file-part-uploaded", {
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

    await this.activeActionModel.deleteByKeyAndType(tempKey, "sending_file");

    const sender = await this.userModel.getById(userId);
    const getter = await this.chatModel.getChatOpponent(chatId, userId);

    await this.sendSocketMessageToUserOpponent(chatId, userId, "get-message", {
      message,
      opponent: sender,
    });

    return await this.sendSocketMessageToUser(userId, "file-part-uploaded", {
      tempKey,
      message,
      opponent: getter,
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

    return await this.sendSocketMessageToUser(userId, "message-cancelled", {
      tempKey,
    });
  };

  onUpdateMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const messageId = data.messageId;
    const text = data.text;

    const message = await this.chatMessageModel.update(messageId, text);

    await this.sendSocketMessageToUserOpponent(
      message.chatId,
      userId,
      "message-updated",
      {
        message,
      }
    );

    return await this.sendSocketMessageToUser(
      userId,
      "success-message-updated",
      {
        message,
      }
    );
  };

  onDeleteMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const messageId = data.messageId;

    const deletedMessage = await this.chatMessageModel.getShortById(messageId);
    const chatId = deletedMessage.chatId;

    const previousMessage = await this.chatMessageModel.getBeforeMessageInChat({
      messageCreatedAt: deletedMessage.createdAt,
      chatId: chatId,
    });

    const deletedPosition =
      await this.chatMessageModel.getMessagePositionInChat({
        messageId,
        chatId,
      });

    const skippedForNew = Math.ceil(deletedPosition / 50) * 50;

    const replacementMessage =
      await this.chatMessageModel.getMessageByChatPosition({
        chatId,
        offset: skippedForNew,
      });

    await this.chatMessageModel.delete(messageId);

    await this.sendSocketMessageToUserOpponent(
      chatId,
      userId,
      "message-deleted",
      {
        deletedMessage,
        previousMessage,
        replacementMessage,
      }
    );

    return await this.sendSocketMessageToUser(
      userId,
      "success-message-deleted",
      {
        deletedMessage,
        previousMessage,
        replacementMessage,
      }
    );
  };
}

module.exports = ChatController;
