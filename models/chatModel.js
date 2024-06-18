require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const chatRelationModel = require("./chatRelationModel");
const chatMessageModel = require("./chatMessageModel");

const CHAT_TABLE = STATIC.TABLES.CHATS;

const CHAT_TYPES = { DISPUTE: "dispute", ORDER: "order" };

class ChatModel extends Model {
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
      entityType: CHAT_TYPES.ORDER,
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
      entityType: CHAT_TYPES.ORDER,
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
}

module.exports = new ChatModel();
