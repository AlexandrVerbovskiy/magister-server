const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.CHAT_MESSAGES, function (table) {
    table.increments("id").primary();
    table.boolean("hidden").defaultTo(false);
    table.boolean("admin_send").defaultTo(false);
    table.string("type");
    table.timestamps(true, true);

    table
      .integer("chat_id")
      .unsigned()
      .references(STATIC.TABLES.CHATS + ".id");

    table
      .integer("sender_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id")
      .nullable()
      .defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.CHAT_MESSAGES);
};
