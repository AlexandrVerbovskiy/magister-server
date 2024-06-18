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

      table.text("content");

      table
        .integer("message_id")
        .unsigned()
        .references(STATIC.TABLES.CHAT_MESSAGES + ".id");

      table.timestamps(true, true);
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
