require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;
const CHAT_TABLE = STATIC.TABLES.CHATS;

class ChatRelationModel extends Model {
  create = async (chatId, userId) => {
    const res = await db(CHAT_RELATION_TABLE)
      .insert({
        chat_id: chatId,
        user_id: userId,
      })
      .returning("id");

    return res[0]["id"];
  };

  checkUserHasRelation = async (chatId, userId) => {
    const result = await db(CHAT_RELATION_TABLE)
      .where({
        chat_id: chatId,
        user_id: userId,
      })
      .select();

    return !!result.length;
  };

  userChatRelationInfo = async (chatId, userId) => {
    const result = await db(CHAT_RELATION_TABLE)
      .where(`${CHAT_RELATION_TABLE}.chat_id`, chatId)
      .where(`${CHAT_RELATION_TABLE}.user_id`, userId)
      .join(
        CHAT_TABLE,
        `${CHAT_TABLE}.id`,
        "=",
        `${CHAT_RELATION_TABLE}.chat_id`
      )
      .select([`${CHAT_TABLE}.id`, `${CHAT_TABLE}.entity_type as entityType`])
      .first();

    return result;
  };

  startTyping = async (chatId, userId) => {
    await db(CHAT_RELATION_TABLE)
      .where({
        chat_id: chatId,
        user_id: userId,
      })
      .update({ typing: true });
  };

  finishTyping = async (chatId, userId) => {
    await db(CHAT_RELATION_TABLE)
      .where({
        chat_id: chatId,
        user_id: userId,
      })
      .update({ typing: false });
  };
}

module.exports = new ChatRelationModel();
