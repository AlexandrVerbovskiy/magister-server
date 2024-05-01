const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.PHONE_VERIFIED_CODES,
    function (table) {
      table.increments("id").primary();
      table.string("code");
      table.timestamps(true, true);

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
  return knex.schema.dropTable(STATIC.TABLES.PHONE_VERIFIED_CODES);
};
