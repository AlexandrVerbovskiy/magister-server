const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.TWO_FACTOR_AUTH_CODES,
    function (table) {
      table.increments("id").primary();
      table.string("code");
      table.string("type_verification").defaultTo("email");
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
  return knex.schema.dropTable(STATIC.TABLES.TWO_FACTOR_AUTH_CODES);
};
