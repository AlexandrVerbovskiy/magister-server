require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;

class ChatMessageContentModel extends Model {
  create = async (messageId, content) => {
    const res = await db(CHAT_MESSAGE_CONTENT_TABLE)
      .insert({
        message_id: messageId,
        content,
      })
      .returning("id");

    return res[0]["id"];
  };
}

module.exports = new ChatMessageContentModel();
