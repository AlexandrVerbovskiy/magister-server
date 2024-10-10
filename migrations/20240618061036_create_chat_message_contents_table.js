const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.CHAT_MESSAGE_CONTENTS,
    function (table) {
      table.increments("id").primary();
      table.json("content");
      table.timestamps(true, true);

      table
        .integer("message_id")
        .unsigned()
        .references(STATIC.TABLES.CHAT_MESSAGES + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.CHAT_MESSAGE_CONTENTS);
};
