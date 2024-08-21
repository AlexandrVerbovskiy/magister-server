require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatRelationModel = require("./chatRelationModel");
const chatMessageModel = require("./chatMessageModel");
const { removeDuplicates } = require("../utils");

const CHAT_TABLE = STATIC.TABLES.CHATS;
const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;
const CHAT_MESSAGE_TABLE = STATIC.TABLES.CHAT_MESSAGES;
const USER_TABLE = STATIC.TABLES.USERS;
const SOCKET_TABLE = STATIC.TABLES.SOCKETS;
const ORDER_TABLE = STATIC.TABLES.ORDERS;
const DISPUTE_TABLE = STATIC.TABLES.DISPUTES;
const LISTING_TABLE = STATIC.TABLES.LISTINGS;

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

  fullVisibleFieldsForAdmin = [
    ...this.fullVisibleFields,
    "tenants.id as tenantId",
    "tenants.name as tenantName",
    "tenants.photo as tenantPhoto",
    "tenant_chats.id as tenantChatId",
    "owners.id as ownerId",
    "owners.name as ownerName",
    "owners.photo as ownerPhoto",
    "owner_chats.id as ownerChatId",
    `${ORDER_TABLE}.id as orderId`,
    `${LISTING_TABLE}.id as listingId`,
    `${DISPUTE_TABLE}.id as disputeId`,
    `${DISPUTE_TABLE}.status as disputeStatus`,
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
    const chatId = await this.create({
      entityId: orderId,
      entityType: STATIC.CHAT_TYPES.ORDER,
      name: `Rental ${listingName}`,
    });

    for (const userId of [ownerId, tenantId]) {
      await chatRelationModel.create(chatId, userId);
    }

    return await chatMessageModel.createNewOrderMessage({
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
  };

  createForDisputeUserChat = async ({
    disputeId,
    userId,
    orderId,
    data: { senderId, senderName, description, type },
  }) => {
    const chatId = await this.create({
      entityId: disputeId,
      entityType: STATIC.CHAT_TYPES.DISPUTE,
      name: `Dispute for order #${orderId}`,
    });

    await chatRelationModel.create(chatId, userId);

    const message = await chatMessageModel.createNewDisputeMessage({
      chatId,
      data: { description, type, senderId, senderName },
    });

    return message;
  };

  createForDispute = async ({
    orderId,
    disputeId,
    userIds,
    data: { senderId, senderName, description, type },
  }) => {
    const createdUsersMessages = {};

    for (const userId of userIds) {
      createdUsersMessages[userId] = await this.createForDisputeUserChat({
        disputeId,
        userId,
        orderId,
        data: { senderId, senderName, description, type },
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

  getListBaseQuery = ({ chatType, userId }) => {
    let query = db(`${CHAT_RELATION_TABLE} as searcher_relation`);

    if (chatType == STATIC.CHAT_TYPES.DISPUTE) {
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
    return referenceItem?.createdAt;
  };

  getChatType = async (chatId) => {
    let query = db(CHAT_TABLE);

    const result = await query
      .where(`${CHAT_TABLE}.id`, chatId)
      .select([`${CHAT_TABLE}.entity_type as entityType`])
      .first();

    return result?.entityType;
  };

  bindChatFilterToQuery = ({ query, chatFilter, isDispute }) => {
    return query.where((builder) => {
      if (isDispute) {
        builder.whereILike(`${CHAT_TABLE}.name`, `%${chatFilter}%`);
      } else {
        builder
          .whereILike(`${CHAT_TABLE}.name`, `%${chatFilter}%`)
          .orWhereILike(`${USER_TABLE}.name`, `%${chatFilter}%`);
      }
    });
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

    const isDispute = chatType == STATIC.CHAT_TYPES.DISPUTE;

    const fields = isDispute
      ? this.fullVisibleFields
      : this.fullVisibleFieldsWithUser;

    let query = this.getListBaseQuery({ chatType, userId });

    let lastChatCreatedTime = null;

    if (lastChatId) {
      lastChatCreatedTime = await this.getChatMessageCreatedDate(lastChatId);

      query = query.where(
        `${CHAT_MESSAGE_TABLE}.created_at`,
        "<",
        lastChatCreatedTime
      );
    }

    if (needChatId) {
      const chatMessageCreatedTime = await this.messageJoin(
        db(CHAT_TABLE).where(`${CHAT_TABLE}.id`, "=", needChatId)
      )
        .select([`${CHAT_MESSAGE_TABLE}.created_at as messageCreatedAt`])
        .first();

      let firstResPartQuery = query.where(
        `${CHAT_MESSAGE_TABLE}.created_at`,
        ">=",
        chatMessageCreatedTime.messageCreatedAt
      );

      firstResPartQuery = this.bindChatFilterToQuery({
        query: firstResPartQuery,
        chatFilter,
        isDispute,
      });

      const firstResPart = await firstResPartQuery
        .select(fields)
        .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

      const firstResPartLength = firstResPart.length;

      result = [...firstResPart];

      if (firstResPartLength == 0 || firstResPartLength % count != 0) {
        let secondResPartQuery = this.getListBaseQuery({
          chatType,
          userId,
        }).where(
          `${CHAT_MESSAGE_TABLE}.created_at`,
          "<",
          chatMessageCreatedTime.messageCreatedAt
        );

        if (lastChatCreatedTime) {
          secondResPartQuery = secondResPartQuery.where(
            `${CHAT_MESSAGE_TABLE}.created_at`,
            "<",
            lastChatCreatedTime
          );
        }

        secondResPartQuery = this.bindChatFilterToQuery({
          query: secondResPartQuery,
          chatFilter,
          isDispute,
        });

        const secondResPart = await secondResPartQuery
          .limit(count - (firstResPartLength % count))
          .select(fields)
          .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

        result = [...result, ...secondResPart];
      }
    } else {
      if (chatFilter) {
        query = this.bindChatFilterToQuery({
          query,
          chatFilter,
          isDispute,
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
      chatType == STATIC.CHAT_TYPES.DISPUTE
        ? this.fullVisibleFields
        : this.fullVisibleFieldsWithUser;

    let query = this.getListBaseQuery({ chatType, userId });

    return await query.where("chat_id", chatId).select(fields).first();
  };

  checkHasMore = async ({
    lastMessageCreatedTime,
    chatType,
    userId,
    chatFilter,
  }) => {
    let query = this.getListBaseQuery({ chatType, userId })
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, "<", lastMessageCreatedTime)
      .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

    if (chatFilter) {
      query = query.where((builder) => {
        if (chatType == STATIC.CHAT_TYPES.DISPUTE) {
          builder.whereILike(`${CHAT_TABLE}.name`, `%${chatFilter}%`);
        } else {
          builder
            .whereILike(`${CHAT_TABLE}.name`, `%${chatFilter}%`)
            .orWhereILike(`${USER_TABLE}.name`, `%${chatFilter}%`);
        }
      });
    }

    const moreChats = await query.select(`${CHAT_TABLE}.id`).first();
    return !!moreChats?.id;
  };

  chatTypeAndDispute = async (chatId) => {
    const chatInfo = await db(CHAT_TABLE)
      .where(`${CHAT_TABLE}.id`, "=", chatId)
      .select(`${CHAT_TABLE}.entity_type as type`)
      .first();

    const type = chatInfo?.type;

    if (!type) {
      return null;
    }

    if (type == STATIC.CHAT_TYPES.ORDER) {
      const chatInfoWithType = await db(CHAT_TABLE)
        .joinRaw(
          `JOIN ${DISPUTE_TABLE} ON (${CHAT_TABLE}.entity_id = ${DISPUTE_TABLE}.order_id)`
        )
        .joinRaw(
          `JOIN ${CHAT_TABLE} as dispute_chats ON (${DISPUTE_TABLE}.id = dispute_chats.entity_id AND dispute_chats.entity_type = '${STATIC.CHAT_TYPES.DISPUTE}')`
        )
        .where(`${CHAT_TABLE}.id`, "=", chatId)
        .select(`${CHAT_TABLE}.entity_type as type`)
        .first();

      if (!chatInfoWithType) {
        return null;
      }

      return {
        type,
        disputeId: chatInfoWithType.disputeId,
        mainChatId: chatId,
      };
    }

    if (type == STATIC.CHAT_TYPES.DISPUTE) {
      const chatInfoWithType = await db(CHAT_TABLE)
        .joinRaw(
          `JOIN ${DISPUTE_TABLE} ON (${CHAT_TABLE}.entity_id = ${DISPUTE_TABLE}.id)`
        )
        .joinRaw(
          `JOIN ${CHAT_TABLE} as order_chats ON (${DISPUTE_TABLE}.order_id = order_chats.entity_id AND order_chats.entity_type = '${STATIC.CHAT_TYPES.ORDER}')`
        )
        .where(`${CHAT_TABLE}.id`, "=", chatId)
        .select([
          `order_chats.entity_type as type`,
          `order_chats.id as orderChatId`,
        ])
        .first();

      if (!chatInfoWithType) {
        return null;
      }

      return {
        type,
        disputeId: chatInfoWithType.disputeId,
        mainChatId: chatInfoWithType.orderChatId,
      };
    }

    return chatInfo?.disputeId;
  };

  baseGetForAdmin = () => {
    const query = db(CHAT_TABLE)
      .joinRaw(
        `JOIN ${ORDER_TABLE} ON (${CHAT_TABLE}.entity_id = ${ORDER_TABLE}.id AND ${CHAT_TABLE}.entity_type = '${STATIC.CHAT_TYPES.ORDER}')`
      )
      .join(
        DISPUTE_TABLE,
        `${DISPUTE_TABLE}.order_id`,
        "=",
        `${ORDER_TABLE}.id`
      )
      .leftJoin(
        `${USER_TABLE} as tenants`,
        `tenants.id`,
        "=",
        `${ORDER_TABLE}.tenant_id`
      )
      .leftJoin(
        LISTING_TABLE,
        `${LISTING_TABLE}.id`,
        "=",
        `${ORDER_TABLE}.listing_id`
      )
      .leftJoin(
        `${USER_TABLE} as owners`,
        `owners.id`,
        "=",
        `${LISTING_TABLE}.owner_id`
      )
      .joinRaw(
        `JOIN ${CHAT_TABLE} as owner_chats ON (owner_chats.entity_id = ${DISPUTE_TABLE}.id AND owner_chats.entity_type = '${STATIC.CHAT_TYPES.DISPUTE}')`
      )
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as owner_chat_relations ON (owner_chat_relations.user_id = owners.id AND owner_chats.id = owner_chat_relations.chat_id)`
      )
      .joinRaw(
        `JOIN ${CHAT_TABLE} as tenant_chats ON (tenant_chats.entity_id = ${DISPUTE_TABLE}.id AND tenant_chats.entity_type = '${STATIC.CHAT_TYPES.DISPUTE}')`
      )
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as tenant_chat_relations ON (tenant_chat_relations.user_id = tenants.id AND tenant_chats.id = tenant_chat_relations.chat_id)`
      );

    return this.messageJoin(query);
  };

  baseChatListFilter = (builder, chatFilter) => {
    return builder
      .whereILike(`tenants.name`, `%${chatFilter}%`)
      .orWhereILike(`owners.name`, `%${chatFilter}%`)
      .orWhereRaw(this.filterIdLikeString(chatFilter, `${DISPUTE_TABLE}.id`));
  };

  bindChatFilterToAdminQuery = ({ query, chatFilter }) => {
    return query.where((builder) => {
      this.baseChatListFilter(builder, chatFilter);
    });
  };

  getForAdminList = async ({
    needChatId = null,
    count = 20,
    lastChatId = null,
    chatFilter = "",
  }) => {
    let result = [];
    let query = this.baseGetForAdmin();
    const fields = this.fullVisibleFieldsForAdmin;
    let lastChatCreatedTime = null;

    if (lastChatId) {
      lastChatCreatedTime = await this.getChatMessageCreatedDate(lastChatId);

      query = query.where(
        `${CHAT_MESSAGE_TABLE}.created_at`,
        "<",
        lastChatCreatedTime
      );
    }

    if (needChatId) {
      const chatMessageCreatedTime = await this.messageJoin(
        db(CHAT_TABLE).where(`${CHAT_TABLE}.id`, "=", needChatId)
      )
        .select(`${CHAT_MESSAGE_TABLE}.created_at as messageCreatedAt`)
        .first();

      let firstResPartQuery = query.where(
        `${CHAT_MESSAGE_TABLE}.created_at`,
        ">=",
        chatMessageCreatedTime.messageCreatedAt
      );

      if (chatFilter) {
        firstResPartQuery = this.bindChatFilterToAdminQuery({
          query: firstResPartQuery,
          chatFilter,
        });
      }

      const firstResPart = await firstResPartQuery
        .select(fields)
        .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

      const firstResPartLength = firstResPart.length;

      result = [...firstResPart];

      if (firstResPartLength == 0 || firstResPartLength % count != 0) {
        let secondResPartQuery = this.baseGetForAdmin().where(
          `${CHAT_MESSAGE_TABLE}.created_at`,
          "<",
          chatMessageCreatedTime.messageCreatedAt
        );

        if (lastChatCreatedTime) {
          secondResPartQuery = secondResPartQuery.where(
            `${CHAT_MESSAGE_TABLE}.created_at`,
            "<",
            lastChatCreatedTime
          );
        }

        if (chatFilter) {
          secondResPartQuery = this.bindChatFilterToAdminQuery({
            query: secondResPartQuery,
            chatFilter,
          });
        }

        const secondResPart = await secondResPartQuery
          .limit(count - (firstResPartLength % count))
          .select(fields)
          .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

        result = [...result, ...secondResPart];
      }
    } else {
      if (chatFilter) {
        query = this.bindChatFilterToAdminQuery({ query, chatFilter });
      }

      result = await query
        .limit(count)
        .select(fields)
        .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");
    }

    return result;
  };

  checkAdminHasMore = async ({ lastMessageCreatedTime, chatFilter }) => {
    let query = this.baseGetForAdmin()
      .where(`${CHAT_MESSAGE_TABLE}.created_at`, "<", lastMessageCreatedTime)
      .orderBy(`${CHAT_MESSAGE_TABLE}.created_at`, "desc");

    if (chatFilter) {
      query = query.where((builder) => {
        this.baseChatListFilter(builder, chatFilter);
      });
    }

    const moreChats = await query.select(`${CHAT_TABLE}.id`).first();
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

  getChatUsersSockets = async (chatId) => {
    const userInfos = await db(`${CHAT_RELATION_TABLE} as searcher_relation`)
      .joinRaw(
        `JOIN ${CHAT_RELATION_TABLE} as opponent_relation ON (searcher_relation.chat_id = opponent_relation.chat_id)`
      )
      .join(
        SOCKET_TABLE,
        `${SOCKET_TABLE}.user_id`,
        "=",
        "opponent_relation.user_id"
      )
      .where(`opponent_relation.chat_id`, "=", chatId)
      .select(`${SOCKET_TABLE}.socket`);

    const sockets = userInfos.map((row) => row.socket);
    const uniqueSockets = removeDuplicates(sockets);
    return uniqueSockets;
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
