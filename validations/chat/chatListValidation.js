const { body } = require("express-validator");
const {
  validateIntegerBody,
  validateSmallStringBody,
} = require("../base");

module.exports = [
  ...validateIntegerBody({
    field: "id",
    fieldName: "Id",
    required: false,
  }),
  ...validateIntegerBody({
    field: "lastChatId",
    fieldName: "Last Chat Id",
    required: false,
  }),
  ...validateSmallStringBody({
    field: "chatFilter",
    fieldName: "Chat Filter",
    required: false,
  }),
  body("chatType")
    .optional({ nullable: true })
    .isIn(["order", "dispute"])
    .withMessage(
      "Body parameter 'Chat type' must be either 'order' or 'dispute'"
    ),
];
