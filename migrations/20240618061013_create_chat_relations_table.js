const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.CHAT_RELATIONS,
    function (table) {
      table.increments("id").primary();
      table.boolean("typing").defaultTo(false);
      table.timestamps(true, true);
      
      table
        .integer("chat_id")
        .unsigned()
        .references(STATIC.TABLES.CHATS + ".id");

      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.CHAT_RELATIONS);
};
