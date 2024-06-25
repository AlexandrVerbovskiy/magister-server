require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatMessageContentModel = require("./chatMessageContentModel");

const CHAT_MESSAGE_TABLE = STATIC.TABLES.CHAT_MESSAGES;
const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;
const USER_TABLE = STATIC.TABLES.USERS;
const CHAT_TABLE = STATIC.TABLES.CHATS;

class ChatMessageModel extends Model {
  visibleFields = [
    `${CHAT_MESSAGE_TABLE}.id`,
    `${CHAT_MESSAGE_TABLE}.hidden`,
    `${CHAT_MESSAGE_TABLE}.admin_send as isAdminSender`,
    `${CHAT_MESSAGE_TABLE}.type`,
    `${CHAT_MESSAGE_TABLE}.chat_id as chatId`,
    `${CHAT_MESSAGE_TABLE}.sender_id as senderId`,
    `${CHAT_MESSAGE_TABLE}.created_at as createdAt`,
  ];

  fullVisibleFields = [
    ...this.visibleFields,
    `${CHAT_MESSAGE_CONTENT_TABLE}.content`,
    `${CHAT_MESSAGE_CONTENT_TABLE}.created_at as updatedAt`,
  ];

  fullVisibleFieldsWithUser = [
    ...this.fullVisibleFields,
    `${CHAT_TABLE}.entity_id as entityId`,
    `${CHAT_TABLE}.entity_type as entityType`,
    `${CHAT_TABLE}.name as chatName`,
    `${USER_TABLE}.photo as senderPhoto`,
    `${USER_TABLE}.name as senderName`,
    `${USER_TABLE}.online as senderOnline`,
  ];

  contentJoin = (query) => {
    return query
      .joinRaw(
        `LEFT JOIN (SELECT message_id, MAX(id) AS last_content_id FROM ${CHAT_MESSAGE_CONTENT_TABLE} GROUP BY message_id) AS lc ON ${CHAT_MESSAGE_TABLE}.id = lc.message_id`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_MESSAGE_CONTENT_TABLE} ON ${CHAT_MESSAGE_CONTENT_TABLE}.id = lc.last_content_id`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_TABLE} ON ${CHAT_TABLE}.id = ${CHAT_MESSAGE_TABLE}.chat_id`
      );
  };

  userInfoJoin = (query) => {
    return query.join(
      USER_TABLE,
      `${USER_TABLE}.id`,
      "=",
      `${CHAT_MESSAGE_TABLE}.sender_id`
    );
  };

  baseJoinQuery = (query) => {
    query = this.contentJoin(query);
    query = this.userInfoJoin(query);
    return query;
  };

  create = async ({
    chatId,
    type,
    isAdminSender = false,
    senderId = null,
    content,
  }) => {
    const res = await db(CHAT_MESSAGE_TABLE)
      .insert({
        type,
        chat_id: chatId,
        admin_send: isAdminSender,
        sender_id: senderId,
      })
      .returning(["id", "created_at as createdAt"]);

    const messageId = res[0]["id"];
    await chatMessageContentModel.create(messageId, content);
    return await this.getFullById(messageId);
  };

  createFileMessage = async ({
    chatId,
    type = STATIC.MESSAGE_TYPES.FILE,
    isAdminSender,
    senderId,
    content: { path, filename },
  }) => {
    return await this.create({
      chatId,
      type,
      isAdminSender,
      senderId,
      content: { path, filename },
    });
  };

  createTextMessage = async ({ chatId, isAdminSender, senderId, text }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.TEXT,
      isAdminSender,
      senderId,
      content: { text },
    });
  };

  createNewOrderMessage = async ({
    chatId,
    senderId,
    data: {
      listingName,
      offerPrice,
      listingPhotoType,
      listingPhotoPath,
      offerDateStart,
      offerDateEnd,
      description,
    },
  }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.NEW_ORDER,
      isAdminSender: false,
      senderId,
      content: {
        listingName,
        offerPrice,
        listingPhotoType,
        listingPhotoPath,
        offerDateStart,
        offerDateEnd,
        description,
      },
    });
  };

  createUpdateOrderMessage = async ({
    chatId,
    senderId,
    data: {
      requestId,
      listingName,
      offerPrice,
      listingPhotoPath,
      listingPhotoType,
      offerDateStart,
      offerDateEnd,
    },
  }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.UPDATE_ORDER,
      isAdminSender: false,
      senderId,
      content: {
        requestId,
        listingName,
        offerPrice,
        listingPhotoPath,
        listingPhotoType,
        offerDateStart,
        offerDateEnd,
      },
    });
  };

  createListingReviewMessage = async ({
    chatId,
    senderId,
    data: {
      punctuality,
      generalExperience,
      communication,
      reliability,
      kindness,
      flexibility,
      description,
    },
  }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.LISTING_REVIEW,
      isAdminSender: false,
      senderId,
      content: {
        punctuality,
        generalExperience,
        communication,
        reliability,
        kindness,
        flexibility,
        description,
      },
    });
  };

  createUserReviewMessage = async ({
    chatId,
    senderId,
    data: {
      quality,
      listingAccuracy,
      utility,
      condition,
      performance,
      location,
      leaveFeedback,
    },
  }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.USER_REVIEW,
      isAdminSender: false,
      senderId,
      content: {
        quality,
        listingAccuracy,
        utility,
        condition,
        performance,
        location,
        leaveFeedback,
      },
    });
  };

  createStartedDisputeMessage = async ({ chatId, senderId, description }) => {
    return await this.create({
      chatId,
      type: STATIC.MESSAGE_TYPES.STARTED_DISPUTE,
      isAdminSender: false,
      senderId,
      content: {
        description,
      },
    });
  };

  delete = async (messageId) => {
    await db(CHAT_MESSAGE_TABLE)
      .where("id", messageId)
      .update({ hidden: true });
  };

  update = async (messageId, text) => {
    await chatMessageContentModel.create(messageId, { text });
    return await this.getFullById(messageId);
  };

  getShortById = async (id) => {
    return await db(CHAT_MESSAGE_TABLE)
      .where("id", id)
      .select(this.visibleFields)
      .first();
  };

  getFullById = async (id) => {
    let query = db(CHAT_MESSAGE_TABLE).where(`${CHAT_MESSAGE_TABLE}.id`, id);
    query = this.baseJoinQuery(query);
    return await query.select(this.fullVisibleFieldsWithUser).first();
  };

  getListBaseQuery = () => {
    let query = db(CHAT_MESSAGE_TABLE);
    query = query.where(`${CHAT_MESSAGE_TABLE}.hidden`, false);
    return this.baseJoinQuery(query);
  };

  getMessageCreatedDate = async (messageId) => {
    const referenceItem = await db(CHAT_MESSAGE_TABLE)
      .select("created_at as createdAt")
      .where("id", messageId)
      .first();

    return referenceItem.createdAt;
  };

  getList = async ({ chatId, count = 50, lastMessageId = null }) => {
    let query = this.getListBaseQuery();

    query = query.where(`${CHAT_MESSAGE_TABLE}.chat_id`, "=", chatId);

    if (lastMessageId) {
      const lastMessageCreatedAt = await this.getMessageCreatedDate(
        lastMessageId
      );
      query = query.where(
        `${CHAT_MESSAGE_TABLE}.created_at`,
        "<",
        lastMessageCreatedAt
      );
    }

    query = query
      .limit(count)
      .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

    const messages = await query.select(this.fullVisibleFieldsWithUser);
    return messages.reverse();
  };

  getBeforeMessageInChat = async ({ messageCreatedAt, chatId }) => {
    let query = this.getListBaseQuery();
    query = query.where(`${CHAT_MESSAGE_TABLE}.chat_id`, "=", chatId);
    query = query
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, "<", messageCreatedAt)
      .orderBy(`${CHAT_MESSAGE_TABLE}.id`, "desc")
      .groupBy([
        `${CHAT_MESSAGE_TABLE}.id`,
        `${CHAT_MESSAGE_TABLE}.created_at`,
      ]);

    const messageInfo = await query.select(`${CHAT_MESSAGE_TABLE}.id`).first();
    const id = messageInfo?.id;

    if (!id) {
      return null;
    }

    return await this.getFullById(id);
  };

  getMessageByChatPosition = async ({ chatId, offset }) => {
    let query = this.getListBaseQuery();
    query = query.where(`${CHAT_MESSAGE_TABLE}.chat_id`, "=", chatId);
    query = query
      .orderBy(`${CHAT_MESSAGE_TABLE}.id`, "desc")
      .groupBy([`${CHAT_MESSAGE_TABLE}.id`, `${CHAT_MESSAGE_TABLE}.created_at`])
      .offset(offset);

    const messageInfo = await query.select(`${CHAT_MESSAGE_TABLE}.id`).first();
    const id = messageInfo.id;

    if (!id) {
      return null;
    }

    return await this.getFullById(id);
  };

  checkHasMore = async ({ messageCreatedAt, chatId }) => {
    const id = await this.getBeforeMessageInChat({
      messageCreatedAt,
      chatId,
    });

    return !!id;
  };

  getMessagePositionInChat = async ({ messageId, chatId }) => {
    const messageCreatedAt = await this.getMessageCreatedDate(messageId);

    let query = this.getListBaseQuery();
    query = query.where(`${CHAT_MESSAGE_TABLE}.chat_id`, "=", chatId);
    query = query
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, ">=", messageCreatedAt)
      .orderBy(`${CHAT_MESSAGE_TABLE}.id`, "desc")
      .groupBy([
        `${CHAT_MESSAGE_TABLE}.id`,
        `${CHAT_MESSAGE_TABLE}.created_at`,
      ]);

    const result = await query.select(`${CHAT_MESSAGE_TABLE}.id`);
    return result.length;
  };
}

module.exports = new ChatMessageModel();
