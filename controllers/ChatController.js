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
  count_message_per_iteration = 20;
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

  onStopEvents = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    await this.stopAllUserActions(userId);
  };

  onDisconnect = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const socket = sessionInfo.socket;

    await this.userModel.updateOnline(userId, false);
    await this.socketModel.disconnect(socket);
    await this.onStopEvents(data, sessionInfo);

    await this.userChatRelationSendMessage(userId, "opponent-offline");
  };

  baseGetChatList = async (req, res) => {
    const chatId = req.body.id ?? null;
    const userId = req.userData.userId;
    let chatType = req.body.chatType;
    const chatFilter = req.body.chatFilter ?? "";
    const count = this.count_chat_per_iteration;
    let lastChatId = req.body.lastChatId ?? null;

    if (chatId) {
      const userChatRelationInfo =
        await this.chatRelationModel.userChatRelationInfo(chatId, userId);

      if (
        !userChatRelationInfo ||
        (chatType && userChatRelationInfo.entityType != chatType)
      ) {
        return { error: STATIC.ERRORS.NOT_FOUND };
      }

      if (!chatType) {
        chatType = userChatRelationInfo.entityType;
      }
    }

    if (!chatType) {
      chatType = STATIC.CHAT_TYPES.ORDER;
    }

    if (chatId) {
      chatType = await this.chatModel.getChatType(chatId);
    }

    if (lastChatId) {
      const lastChat = await this.chatModel.getById(lastChatId);

      if (!lastChat) {
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
        chatFilter,
      });

      chatType = lastChat["entityType"];
    }

    return {
      error: null,
      list: chatList,
      canShowMore,
      options: {
        chatType,
      },
      dopInfo: {},
    };
  };

  baseGetAdminChatList = async (req, res) => {
    const chatId = req.body.id ?? null;
    const chatFilter = req.body.chatFilter ?? "";
    const count = this.count_chat_per_iteration;
    const lastChatId = req.body.lastChatId ?? null;

    let mainSearchChatId = chatId;
    let searchChatType = null;
    let searchChatDisputeId;

    if (chatId) {
      const resChatSearching = await this.chatModel.chatTypeAndDispute(chatId);

      if (!resChatSearching) {
        return { error: STATIC.ERRORS.NOT_FOUND };
      }

      mainSearchChatId = resChatSearching.mainChatId;
      searchChatType = resChatSearching.type;
      searchChatDisputeId = resChatSearching.disputeId;
    }

    const chatList = await this.chatModel.getForAdminList({
      needChatId: mainSearchChatId,
      count,
      lastChatId,
      chatFilter,
    });

    const lastChat = chatList[chatList.length - 1];

    let canShowMore = false;

    if (lastChat) {
      canShowMore = await this.chatModel.checkAdminHasMore({
        lastMessageCreatedTime: lastChat.messageCreatedAt,
        chatFilter,
      });
    }

    return {
      error: null,
      list: chatList,
      canShowMore,
      dopInfo: { mainSearchChatId, searchChatType },
    };
  };

  getChatListWrapper = (req, res, func) =>
    this.baseWrapper(req, res, async () => {
      const chatRes = await func(req, res);

      if (chatRes.error) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          chatRes.error
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chats: chatRes.list,
        chatsCanShowMore: chatRes.canShowMore,
        options: chatRes.options,
        ...chatRes.dopInfo,
      });
    });

  getChatList = async (req, res) =>
    this.getChatListWrapper(req, res, () => this.baseGetChatList(req, res));

  getChatListForAdmin = (req, res) =>
    this.getChatListWrapper(req, res, () =>
      this.baseGetAdminChatList(req, res)
    );

  baseGetChatMessageList = async (req, res) => {
    const chatId = req.body.id;
    const count = this.count_message_per_iteration;
    const lastMessageId = req.body.lastMessageId ?? null;

    if (lastMessageId) {
      const message = await this.chatMessageModel.getFullById(lastMessageId);

      if (!message || message.chatId != chatId) {
        return {
          error: "Last message not found in chat",
          list: [],
          canShowMore: false,
          options: {},
        };
      }
    }

    const messageList = await this.chatMessageModel.getList({
      chatId,
      count,
      lastMessageId,
    });

    const lastMessage = messageList[0];

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

  baseGetAdminChatMessageList = async (req, res) => {
    const chatId = req.body.id;
    const count = this.count_message_per_iteration;
    const lastMessageId = req.body.lastMessageId ?? null;

    const chatType = await this.chatModel.getChatType(chatId);

    if (!chatType) {
      return {
        error: "Chat not found",
        list: [],
        canShowMore: false,
        options: {},
      };
    }

    if (lastMessageId) {
      const message = await this.chatMessageModel.getFullById(lastMessageId);

      if (!message || message.chatId != chatId) {
        return {
          error: "Last message not found in chat",
          list: [],
          canShowMore: false,
          options: {},
        };
      }
    }

    const getList =
      chatType == STATIC.CHAT_TYPES.ORDER
        ? this.chatMessageModel.getFullList
        : this.chatMessageModel.getList;

    const checkHasMore =
      chatType == STATIC.CHAT_TYPES.ORDER
        ? this.chatMessageModel.checkHasFullMore
        : this.chatMessageModel.checkHasMore;

    const messageList = await getList({
      chatId,
      count,
      lastMessageId,
    });

    const lastMessage = messageList[0];

    let canShowMore = false;

    if (lastMessage) {
      canShowMore = await checkHasMore({
        messageCreatedAt: lastMessage.createdAt,
        chatId,
      });
    }

    let resultList = messageList;

    if (chatType == STATIC.CHAT_TYPES.ORDER) {
      resultList = await this.chatMessageContentModel.bindContentsToMessages(
        messageList
      );
    }

    return {
      error: null,
      list: resultList,
      canShowMore,
      options: {},
    };
  };

  getChatMessageList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const chatId = req.body.id;
      const userId = req.userData.userId;

      const userHasChatAccess =
        await this.chatRelationModel.checkUserHasRelation(chatId, userId);

      if (!userHasChatAccess) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const messagesRes = await this.baseGetChatMessageList(req, res);

      if (messagesRes.error) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          messagesRes.error
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        messages: messagesRes.list,
        messagesCanShowMore: messagesRes.canShowMore,
        options: messagesRes.options,
      });
    });

  getChatMessageListForAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const messagesRes = await this.baseGetAdminChatMessageList(req, res);

      if (messagesRes.error) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          messagesRes.error
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        messages: messagesRes.list,
        messagesCanShowMore: messagesRes.canShowMore,
        options: messagesRes.options,
      });
    });

  baseGetChatEntityInfo = async (chatId, userId) => {
    const chat = await this.chatModel.getById(chatId);

    let entity = null;
    const dopEntityInfo = {};

    if (chat.entityType === STATIC.CHAT_TYPES.DISPUTE) {
      entity = await this.disputeModel.getById(chat.entityId);
      entity["type"] = STATIC.CHAT_TYPES.DISPUTE;
    } else {
      entity = await this.orderModel.getFullByIdWithDisputeChat(
        chat.entityId,
        userId
      );

      entity["canFastCancelPayed"] =
        this.orderModel.canFastCancelPayedOrder(entity);

      dopEntityInfo["workerBaseCommission"] =
        await this.systemOptionModel.getWorkerBaseCommissionPercent();

      dopEntityInfo["bankInfo"] =
        await this.systemOptionModel.getBankAccountInfo();

      entity = await this.orderController.wrapOrderFullInfo(entity, userId);
      entity["type"] = STATIC.CHAT_TYPES.ORDER;

      entity["paymentInfo"] =
        await this.senderPaymentModel.getInfoAboutOrderPayment(chat.entityId);
    }

    return { entity, dopEntityInfo };
  };

  baseGetChatDisputeInfo = async (chatId) => {
    const dopInfo = {};
    const chat = await this.chatModel.getById(chatId);

    const isDisputeChat = chat.entityType == STATIC.CHAT_TYPES.DISPUTE;

    let dispute = null;
    let order = null;

    if (isDisputeChat) {
      dispute = await this.disputeModel.getFullById(chat.entityId);
      order = await this.orderModel.getFullById(dispute.orderId);
    } else {
      order = await this.orderModel.getFullById(chat.entityId);
      dispute = await this.disputeModel.getFullById(order.disputeId);
    }

    dopInfo["workerBaseCommission"] =
      await this.systemOptionModel.getWorkerBaseCommissionPercent();

    dopInfo["bankInfo"] = await this.systemOptionModel.getBankAccountInfo();

    return {
      order,
      dispute,
      dopInfo,
      mainSearchChatId: chat.chatId,
      searchChatType: chat.entityType,
      searchChatDisputeId: dispute.id,
    };
  };

  getChatBaseInfo = async ({
    req,
    res,
    getChatDopInfo,
    needCheckAccess = true,
    getMessageList,
  }) => {
    const chatId = req.body.id;
    const userId = req.userData.userId;

    if (needCheckAccess) {
      const userHasChatAccess =
        await this.chatRelationModel.checkUserHasRelation(chatId, userId);

      if (!userHasChatAccess) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }
    }

    const messagesRes = await getMessageList(req, res);

    if (messagesRes.error) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.BAD_REQUEST,
        messagesRes.error
      );
    }

    const chatInfo = await getChatDopInfo();

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      messages: messagesRes.list,
      messagesCanShowMore: messagesRes.canShowMore,
      options: messagesRes.options,
      ...chatInfo,
    });
  };

  getChatInfoByUser = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const chatId = req.body.id;
      const userId = req.userData.userId;

      return this.getChatBaseInfo({
        req,
        res,
        getChatDopInfo: () => this.baseGetChatEntityInfo(chatId, userId),
        getMessageList: this.baseGetChatMessageList,
      });
    });

  getChatInfoByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const chatId = req.body.id;
      const type = await this.chatModel.getChatType(chatId);

      return this.getChatBaseInfo({
        req,
        res,
        getChatDopInfo: () => this.baseGetChatDisputeInfo(chatId),
        getMessageList:
          type === STATIC.CHAT_TYPES.DISPUTE
            ? this.baseGetChatMessageList
            : this.baseGetAdminChatMessageList,
        needCheckAccess: false,
      });
    });

  baseSendTextMessage = async (data, sessionInfo, isAdminSender = false) => {
    const senderId = sessionInfo.userId;
    const chatId = data.chatId;

    return await this.chatMessageModel.createTextMessage({
      chatId,
      isAdminSender,
      senderId,
      text: data.text,
    });
  };

  onSendTextMessage = async (data, sessionInfo) => {
    const senderId = sessionInfo.userId;
    const chatId = data.chatId;

    let getter = null;
    const message = await this.baseSendTextMessage(data, sessionInfo, false);
    const sender = await this.userModel.getById(senderId);

    if (message.entityType == STATIC.CHAT_TYPES.ORDER) {
      getter = await this.chatModel.getChatOpponent(chatId, senderId);

      await this.sendSocketMessageToUserOpponent(
        chatId,
        senderId,
        "get-message",
        {
          message,
          opponent: sender,
        }
      );
    } else {
      await this.sendSocketMessageToAdmins("admin-get-message", {
        message,
        opponent: sender,
      });
    }

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

  onSendTextMessageByAdmin = async (data, sessionInfo) => {
    const senderId = sessionInfo.userId;
    const chatId = data.chatId;

    const message = await this.baseSendTextMessage(data, sessionInfo, true);
    const sender = await this.userModel.getById(senderId);

    await this.sendSocketMessageToChatUsers(chatId, "get-message", {
      message,
      opponent: sender,
    });

    return await this.sendSocketMessageToUser(
      senderId,
      "admin-success-sended-message",
      {
        message,
        tempKey: data.tempKey,
        opponent: null,
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
    let path = null;

    if (!info || !info.data) {
      path =
        this.message_files_dir + "/" + generateRandomString() + "." + filetype;

      await this.awsS3
        .putObject({
          Bucket: this.awsBucketName,
          Key: "public/" + path,
          Body: data,
        })
        .promise();

      const actionInfo = JSON.stringify({
        path: path,
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

      const currentFileData = await this.awsS3
        .getObject({
          Bucket: this.awsBucketName,
          Key: "public/" + path,
        })
        .promise();

      const updatedData = Buffer.concat([currentFileData.Body, data]);

      await this.awsS3
        .putObject({
          Bucket: this.awsBucketName,
          Key: "public/" + path,
          Body: updatedData,
        })
        .promise();
    }

    return path;
  };

  baseOnFilePartUpload = async (data, sessionInfo) => {
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
      return { last: false, tempKey };
    }

    const message = await this.chatMessageModel.createFileMessage({
      chatId,
      type: indicateMediaTypeByExtension(filetype),
      isAdminSender: false,
      senderId: userId,
      content: { path, filename },
    });

    await this.activeActionModel.deleteByKeyAndType(tempKey, "sending_file");

    return { last: true, tempKey, message };
  };

  onFilePartUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const { chatId } = data;

    const {
      message = null,
      last,
      tempKey,
    } = await this.baseOnFilePartUpload(data, sessionInfo);

    if (!last) {
      return await this.sendSocketMessageToUser(userId, "file-part-uploaded", {
        tempKey,
      });
    }

    const sender = await this.userModel.getById(userId);

    let getter = null;

    if (message.entityType == STATIC.CHAT_TYPES.ORDER) {
      getter = await this.chatModel.getChatOpponent(chatId, userId);

      await this.sendSocketMessageToUserOpponent(
        chatId,
        userId,
        "get-message",
        {
          message,
          opponent: sender,
        }
      );
    } else {
      await this.sendSocketMessageToAdmins("admin-get-message", {
        message,
        opponent: sender,
      });
    }

    return await this.sendSocketMessageToUser(userId, "file-part-uploaded", {
      tempKey,
      message,
      opponent: getter,
    });
  };

  onFilePartUploadByAdmin = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const { chatId } = data;

    const {
      message = null,
      last,
      tempKey,
    } = await this.baseOnFilePartUpload(data, sessionInfo);

    if (!last) {
      return await this.sendSocketMessageToUser(
        userId,
        "admin-file-part-uploaded",
        {
          tempKey,
        }
      );
    }

    const sender = await this.userModel.getById(userId);

    await this.sendSocketMessageToChatUsers(chatId, "get-message", {
      message,
      opponent: sender,
    });

    return await this.sendSocketMessageToUser(
      userId,
      "admin-file-part-uploaded",
      {
        tempKey,
        message,
        opponent: null,
      }
    );
  };

  deleteFileAction = async (key) =>
    await this.activeActionModel.deleteByKeyAndType(key, "sending_file");

  onStopFile = async (key) => {
    const info = await this.activeActionModel.getByKeyAndType(
      key,
      "sending_file"
    );

    const { path } = JSON.parse(info.data);
    this.removeFile(path);
    await this.deleteFileAction(key);
  };

  stopAllUserActions = async (userId) => {
    const actions = await this.activeActionModel.getUserActions(userId);

    actions.forEach(async (action) => {
      if (action.type == "sending_file") {
        const key = action.key;
        const info = action.data;

        const { path } = JSON.parse(info);
        this.removeFile(path);
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

  baseOnUpdate = async (data, sessionInfo, updateFunc) => {
    const userId = sessionInfo.userId;
    const messageId = data.messageId;
    const text = data.text;

    return await updateFunc({ messageId, text, userId });
  };

  onUpdateMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const message = await this.baseOnUpdate(
      data,
      sessionInfo,
      ({ messageId, text, userId }) =>
        this.chatMessageModel.updateIfAuthor(messageId, text, userId)
    );

    if (message.entityType == STATIC.CHAT_TYPES.ORDER) {
      await this.sendSocketMessageToUserOpponent(
        message.chatId,
        userId,
        "message-updated",
        {
          message,
        }
      );
    } else {
      await this.sendSocketMessageToAdmins("admin-message-updated", {
        message,
      });
    }
  };

  onUpdateMessageByAdmin = async (data, sessionInfo) => {
    const message = await this.baseOnUpdate(
      data,
      sessionInfo,
      ({ messageId, text }) => this.chatMessageModel.update(messageId, text)
    );

    await this.sendSocketMessageToChatUsers(message.chatId, "message-updated", {
      message,
    });
  };

  baseOnDelete = async (data, sessionInfo, deleteFunc) => {
    const userId = sessionInfo.userId;
    const messageId = data.messageId;

    const deletedMessage = await this.chatMessageModel.getFullById(messageId);
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

    await deleteFunc({ messageId, userId });

    return { deletedMessage, replacementMessage, previousMessage };
  };

  onDeleteMessage = async (data, sessionInfo) => {
    const { deletedMessage, replacementMessage, previousMessage } =
      await this.baseOnDelete(data, sessionInfo, ({ messageId, userId }) =>
        this.chatMessageModel.deleteIfAuthor(messageId, userId)
      );

    if (deletedMessage.entityType == STATIC.CHAT_TYPES.ORDER) {
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
    } else {
      await this.sendSocketMessageToAdmins("admin-message-deleted", {
        deletedMessage,
        previousMessage,
        replacementMessage,
      });
    }

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

  onDeleteMessageByAdmin = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;

    const { deletedMessage, replacementMessage, previousMessage } =
      await this.baseOnDelete(data, sessionInfo, ({ messageId }) =>
        this.chatMessageModel.delete(messageId)
      );

    await this.sendSocketMessageToChatUsers(
      deletedMessage.chatId,
      "success-message-deleted",
      {
        deletedMessage,
        previousMessage,
        replacementMessage,
      }
    );

    return await this.sendSocketMessageToUser(
      userId,
      "admin-success-message-deleted",
      {
        deletedMessage,
        previousMessage,
        replacementMessage,
      }
    );
  };
}

module.exports = ChatController;
