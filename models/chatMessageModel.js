require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatMessageContentModel = require("./chatMessageContentModel");

const CHAT_MESSAGE_TABLE = STATIC.TABLES.CHAT_MESSAGES;
const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;

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

  baseJoinQuery = (query) => {
    const latestContents = db(CHAT_MESSAGE_CONTENT_TABLE)
      .select(
        `${CHAT_MESSAGE_CONTENT_TABLE}.message_id`,
        db.raw(
          `MAX(${CHAT_MESSAGE_CONTENT_TABLE}.created_at) as max_created_at`
        )
      )
      .groupBy(`${CHAT_MESSAGE_CONTENT_TABLE}.message_id`);

    query = query.leftJoin(
      function () {
        this.from(CHAT_MESSAGE_CONTENT_TABLE)
          .join(latestContents.as("latest_contents"), function () {
            this.on(
              `${CHAT_MESSAGE_CONTENT_TABLE}.message_id`,
              "=",
              "latest_contents.message_id"
            ).andOn(
              `${CHAT_MESSAGE_CONTENT_TABLE}.created_at`,
              "=",
              "latest_contents.max_created_at"
            );
          })
          .as("message_contents");
      },
      "messages.id",
      "message_contents.message_id"
    );

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
    const createdAt = res[0]["createdAt"];

    await chatMessageContentModel.create(messageId, content);

    return {
      messageId,
      createdAt,
      type,
      chatId,
      isAdminSender,
      senderId,
      hidden: false,
    };
  };

  createFileMessage = async ({
    chatId,
    type = STATIC.MESSAGE_TYPES.FILE,
    isAdminSender,
    senderId,
    path,
  }) => {
    return await this.create({
      chatId,
      type,
      isAdminSender,
      senderId,
      content: { path },
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

  createAudioMessage = async ({ chatId, isAdminSender, senderId, path }) => {
    return await this.createFileMessage({
      chatId,
      type: STATIC.MESSAGE_TYPES.AUDIO,
      isAdminSender,
      senderId,
      content: { path },
    });
  };

  createPhotoMessage = async ({ chatId, isAdminSender, senderId, path }) => {
    return await this.createFileMessage({
      chatId,
      type: STATIC.MESSAGE_TYPES.PHOTO,
      isAdminSender,
      senderId,
      content: { path },
    });
  };

  createVideoMessage = async ({ chatId, isAdminSender, senderId, path }) => {
    return await this.createFileMessage({
      chatId,
      type: STATIC.MESSAGE_TYPES.VIDEO,
      isAdminSender,
      senderId,
      content: { path },
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
      .select(this.visibleFields);
  };

  getFullById = async (id) => {
    let query = db(CHAT_MESSAGE_TABLE)
      .where("id", id)
      .select(this.fullVisibleFields);

    query = this.baseJoinQuery(query);
    return await query;
  };
}

module.exports = new ChatMessageModel();
