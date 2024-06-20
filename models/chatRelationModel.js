require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const CHAT_RELATION_TABLE = STATIC.TABLES.CHAT_RELATIONS;

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
