require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatMessageContentModel = require("./chatMessageContentModel");

const CHAT_MESSAGE_TABLE = STATIC.TABLES.CHAT_MESSAGES;
const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;
const USER_TABLE = STATIC.TABLES.USERS;

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
    const resultMessage = await this.getFullById(messageId);
    return resultMessage;
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
      listingName,
      offerPrice,
      listingPhotoPath,
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
        listingName,
        offerPrice,
        listingPhotoPath,
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
      .where("message_id", messageId)
      .update({ hidden: true });
  };

  update = async (messageId, newContent) => {
    await chatMessageContentModel.create(messageId, newContent);
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

  checkHasMore = async ({ chatId, lastMessageId }) => {
    const lastMessageCreatedAt = await this.getMessageCreatedDate(
      lastMessageId
    );

    let query = this.getListBaseQuery();
    query = query.where(`${CHAT_MESSAGE_TABLE}.chat_id`, "=", chatId);
    query = query
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, "<", lastMessageCreatedAt)
      .orderBy(`${CHAT_MESSAGE_TABLE}.id`, "desc")
      .groupBy([
        `${CHAT_MESSAGE_TABLE}.id`,
        `${CHAT_MESSAGE_TABLE}.created_at`,
      ]);

    const moreMessages = await query.select(`${CHAT_MESSAGE_TABLE}.id`).first();
    return !!moreMessages?.id;
  };
}

module.exports = new ChatMessageModel();
