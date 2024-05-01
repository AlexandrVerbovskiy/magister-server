const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTable(STATIC.TABLES.RESET_PASSWORD_TOKENS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.RESET_PASSWORD_TOKENS,
    function (table) {
      table.increments("id").primary();
      table.string("token");
      table.timestamps(true, true);

      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");
    }
  );
};
