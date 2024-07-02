require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const CHAT_MESSAGE_CONTENT_TABLE = STATIC.TABLES.CHAT_MESSAGE_CONTENTS;

class ChatMessageContentModel extends Model {
  visibleFields = [
    `${CHAT_MESSAGE_CONTENT_TABLE}.id`,
    `${CHAT_MESSAGE_CONTENT_TABLE}.content`,
    `${CHAT_MESSAGE_CONTENT_TABLE}.message_id as messageId`,
    `${CHAT_MESSAGE_CONTENT_TABLE}.created_at as updatedAt`,
  ];

  create = async (messageId, content) => {
    const res = await db(CHAT_MESSAGE_CONTENT_TABLE)
      .insert({
        message_id: messageId,
        content,
      })
      .returning("id");

    return res[0]["id"];
  };

  bindContentsToMessages = async (messages) => {
    const idsToBind = messages
      .filter((message) => message.type == STATIC.MESSAGE_TYPES.TEXT)
      .map((message) => message.id);

    const contents = await db(CHAT_MESSAGE_CONTENT_TABLE)
      .whereIn(`message_id`, idsToBind)
      .select(this.visibleFields);

    const boundMessages = messages.map((message) => {
      message["contentStory"] = [];

      if (message.type == STATIC.MESSAGE_TYPES.TEXT) {
        message["contentStory"] = contents
          .filter((content) => content.messageId == message.id)
          .map((content) => ({
            contentId: content.id,
            content: content.content,
            updatedAt: content.updatedAt,
          }));
      } else {
        message["contentStory"] = {
          content: message.content,
          updatedAt: message.updatedAt,
        };
      }

      return message;
    });

    return boundMessages;
  };
}

module.exports = new ChatMessageContentModel();
