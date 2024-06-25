require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatRelationModel = require("./chatRelationModel");
const chatMessageModel = require("./chatMessageModel");

const CHAT_TABLE = STATIC.TABLES.CHATS;
const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;
const CHAT_MESSAGE_TABLE = STATIC.TABLES.CHAT_MESSAGES;
const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;
const USER_TABLE = STATIC.TABLES.USERS;
const SOCKET_TABLE = STATIC.TABLES.SOCKETS;

class ChatModel extends Model {
  visibleFields = [
    `${CHAT_TABLE}.id`,
    `${CHAT_TABLE}.entity_id as entityId`,
    `${CHAT_TABLE}.entity_type as entityType`,
    `${CHAT_TABLE}.name as name`,
  ];

  fullVisibleFields = [
    ...this.visibleFields,
    `${CHAT_MESSAGE_TABLE}.id as messageId`,
    `${CHAT_MESSAGE_TABLE}.type as messageType`,
    `${CHAT_MESSAGE_TABLE}.sender_id as messageSenderId`,
    `${CHAT_MESSAGE_TABLE}.created_at as messageCreatedAt`,
  ];

  fullVisibleFieldsWithUser = [
    ...this.fullVisibleFields,
    `${USER_TABLE}.id as opponentId`,
    `${USER_TABLE}.photo as opponentPhoto`,
    `${USER_TABLE}.name as opponentName`,
    `${USER_TABLE}.online as opponentOnline`,
    `opponent_relation.typing as opponentTyping`,
  ];

  create = async ({ name, entityId, entityType }) => {
    const res = await db(CHAT_TABLE)
      .insert({
        entity_id: entityId,
        entity_type: entityType,
        name,
      })
      .returning("id");

    return res[0]["id"];
  };

  getById = (chatId) => this.baseGetById(chatId, CHAT_TABLE);

  createForOrder = async ({
    ownerId,
    tenantId,
    orderInfo: {
      orderId,
      listingName,
      offerPrice,
      listingPhotoType,
      listingPhotoPath,
      offerDateStart,
      offerDateEnd,
      description,
    },
  }) => {
    const createdUsersMessages = {};

    const chatId = await this.create({
      entityId: orderId,
      entityType: STATIC.CHAT_TYPES.ORDER,
      name: `Rental ${listingName}`,
    });

    for (const userId of [ownerId, tenantId]) {
      await chatRelationModel.create(chatId, userId);
    }

    const createdMessage = await chatMessageModel.createNewOrderMessage({
      chatId,
      senderId: tenantId,
      data: {
        listingName,
        offerPrice,
        listingPhotoType,
        listingPhotoPath,
        offerDateStart,
        offerDateEnd,
        description,
      },
    });

    createdUsersMessages[ownerId] = createdMessage;
    createdUsersMessages[tenantId] = createdMessage;

    return createdUsersMessages;
  };

  createForDisputeUserChat = async ({
    disputeId,
    userId,
    senderId,
    description,
    orderId,
  }) => {
    const chatId = await this.create({
      entityId: disputeId,
      entityType: STATIC.CHAT_TYPES.ORDER,
      name: `Dispute for order #${orderId}`,
    });

    await chatRelationModel.create(chatId, userId);

    const message = await chatMessageModel.createStartedDisputeMessage({
      chatId,
      senderId,
      description,
    });

    return message;
  };

  createForDispute = async ({
    orderId,
    disputeId,
    userIds,
    senderId,
    description,
  }) => {
    const createdUsersMessages = {};

    for (const userId of userIds) {
      createdUsersMessages[userId] = await this.createForDisputeUserChat({
        disputeId,
        userId,
        senderId,
        description,
        orderId,
      });
    }

    return createdUsersMessages;
  };

  messageJoin = (query) => {
    return query
      .joinRaw(
        `LEFT JOIN (SELECT chat_id, MAX(id) AS last_message_id FROM ${CHAT_MESSAGE_TABLE} WHERE ${CHAT_MESSAGE_TABLE}.hidden = false GROUP BY ${CHAT_MESSAGE_TABLE}.chat_id) AS lm ON ${CHAT_TABLE}.id = lm.chat_id`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_MESSAGE_TABLE} ON ${CHAT_MESSAGE_TABLE}.chat_id = ${CHAT_TABLE}.id AND ${CHAT_MESSAGE_TABLE}.id = lm.last_message_id`
      );
  };

  fullMessageInfoJoin = (query) => {
    query = query
      .joinRaw(
        `LEFT JOIN (SELECT chat_id, MAX(id) AS last_message_id FROM ${CHAT_MESSAGE_TABLE} WHERE ${CHAT_MESSAGE_TABLE}.hidden = false GROUP BY ${CHAT_MESSAGE_TABLE}.chat_id) AS lm ON ${CHAT_TABLE}.id = lm.chat_id`
      )
      .joinRaw(
        `LEFT JOIN ${CHAT_MESSAGE_TABLE} ON ${CHAT_MESSAGE_TABLE}.chat_id = ${CHAT_TABLE}.id AND ${CHAT_MESSAGE_TABLE}.id = lm.last_message_id`
      );

    return chatMessageModel.contentJoin(query);
  };

  getListBaseQuery = ({ chatType, userId }) => {
    let query = db(`${CHAT_RELATION_TABLE} as searcher_relation`);

    if (chatType == "disputes") {
      query = query
        .join(CHAT_TABLE, `${CHAT_TABLE}.id`, "=", "searcher_relation.chat_id")
        .where(`${CHAT_TABLE}.entity_type`, "=", STATIC.CHAT_TYPES.DISPUTE);
    } else {
      query = query
        .joinRaw(
          `JOIN ${CHAT_RELATION_TABLE} as opponent_relation ON (searcher_relation.chat_id = opponent_relation.chat_id AND opponent_relation.user_id != ?)`,
          [userId]
        )
        .join(CHAT_TABLE, `${CHAT_TABLE}.id`, "=", "searcher_relation.chat_id")
        .join(USER_TABLE, `${USER_TABLE}.id`, "=", "opponent_relation.user_id")
        .where(`${CHAT_TABLE}.entity_type`, "=", STATIC.CHAT_TYPES.ORDER);
    }

    query = query.where(`searcher_relation.user_id`, "=", userId);

    return this.messageJoin(query);
  };

  getChatMessageCreatedDate = async (chatId) => {
    let query = db(CHAT_TABLE);
    query = this.messageJoin(query)
      .where(`${CHAT_TABLE}.id`, chatId)
      .select([`${CHAT_MESSAGE_TABLE}.created_at as createdAt`]);

    const referenceItem = await query.first();
    return referenceItem.createdAt;
  };

  getList = async ({
    chatType,
    userId,
    needChatId = null,
    count = 20,
    lastChatId = null,
    chatFilter = "",
  }) => {
    let result = [];

    const fields =
      chatType == "disputes"
        ? this.fullVisibleFields
        : this.fullVisibleFieldsWithUser;

    let query = this.getListBaseQuery({ chatType, userId });

    if (lastChatId) {
      const lastChatCreatedTime = await this.getChatMessageCreatedDate(
        lastChatId
      );

      query = query.where(`${CHAT_MESSAGE_TABLE}.id`, "<", lastChatCreatedTime);
    }

    if (needChatId) {
      const chatMessageCreatedTime = await this.messageJoin(
        db(CHAT_TABLE).where(`${CHAT_TABLE}.id`, "=", needChatId)
      )
        .select(`${CHAT_MESSAGE_TABLE}.created_at as messageCreatedAt`)
        .first();

      const firstResPart = await query
        .where(
          `${CHAT_MESSAGE_TABLE}.created_at`,
          ">=",
          chatMessageCreatedTime.messageCreatedAt
        )
        .select(fields)
        .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

      const firstResPartLength = firstResPart.length;

      result = [...firstResPart];

      if (firstResPartLength % count != 0) {
        const secondResPart = await this.getListBaseQuery({ chatType, userId })
          .where(
            `${CHAT_MESSAGE_TABLE}.created_at`,
            "<",
            chatMessageCreatedTime.messageCreatedAt
          )
          .limit(count - (firstResPartLength % count))
          .select(fields)
          .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

        result = [...result, ...secondResPart];
      }
    } else {
      if (chatFilter) {
        query = query.where((builder) => {
          builder
            .whereILike(`${CHAT_TABLE}.name`, `%${chatFilter}%`)
            .orWhereILike(`${USER_TABLE}.name`, `%${chatFilter}%`);
        });
      }

      result = await query
        .limit(count)
        .select(fields)
        .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");
    }

    return result;
  };

  getFullById = async ({ chatId, chatType, userId }) => {
    const fields =
      chatType == "disputes"
        ? this.fullVisibleFields
        : this.fullVisibleFieldsWithUser;

    let query = this.getListBaseQuery({ chatType, userId });

    return await query.where("chat_id", chatId).select(fields).first();
  };

  checkHasMore = async ({ lastMessageCreatedTime, chatType, userId }) => {
    const moreChats = await this.getListBaseQuery({ chatType, userId })
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, "<", lastMessageCreatedTime)
      .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc")
      .select(`${CHAT_TABLE}.id`)
      .first();

    return !!moreChats?.id;
  };

  getChatOpponent = async (chatId, userId) => {
    const opponentInfo = await db(`${CHAT_RELATION_TABLE} as searcher_relation`)
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as opponent_relation ON (searcher_relation.chat_id = opponent_relation.chat_id AND opponent_relation.user_id != ?)`,
        [userId]
      )
      .join(USER_TABLE, `${USER_TABLE}.id`, "=", `opponent_relation.user_id`)
      .where(`opponent_relation.chat_id`, "=", chatId)
      .where("searcher_relation.user_id", "=", userId)
      .select([
        `${USER_TABLE}.id`,
        `${USER_TABLE}.name`,
        `${USER_TABLE}.photo`,
        `${USER_TABLE}.online`,
      ])
      .first();

    return opponentInfo;
  };

  getChatOpponentSockets = async (chatId, userId) => {
    const opponentInfo = await db(`${CHAT_RELATION_TABLE} as searcher_relation`)
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as opponent_relation ON (searcher_relation.chat_id = opponent_relation.chat_id AND opponent_relation.user_id != ?)`,
        [userId]
      )
      .join(
        SOCKET_TABLE,
        `${SOCKET_TABLE}.user_id`,
        "=",
        "opponent_relation.user_id"
      )
      .where(`opponent_relation.chat_id`, "=", chatId)
      .where("searcher_relation.user_id", "=", userId)
      .select(`${SOCKET_TABLE}.socket`);

    return opponentInfo.map((row) => row.socket);
  };

  getUserChatsOpponentSockets = async (userId) => {
    const opponentInfos = await db(
      `${CHAT_RELATION_TABLE} as searcher_relation`
    )
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as opponent_relation ON (searcher_relation.chat_id = opponent_relation.chat_id AND opponent_relation.user_id != ?)`,
        [userId]
      )
      .join(
        SOCKET_TABLE,
        `${SOCKET_TABLE}.user_id`,
        "=",
        "opponent_relation.user_id"
      )
      .select([`${SOCKET_TABLE}.socket`, `opponent_relation.chat_id as chatId`])
      .where(`searcher_relation.user_id`, userId);

    return opponentInfos;
  };
}

module.exports = new ChatModel();