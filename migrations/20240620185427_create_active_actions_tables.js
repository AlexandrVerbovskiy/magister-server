const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.ACTIVE_ACTIONS,
    function (table) {
      table.increments("id").primary().notNullable();
      table.integer("user_id").notNullable();
      table.text("type").notNullable();
      table.text("data");
      table.text("key");
      table.foreign("user_id").references("id").inTable(STATIC.TABLES.USERS);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ACTIVE_ACTIONS);
};
