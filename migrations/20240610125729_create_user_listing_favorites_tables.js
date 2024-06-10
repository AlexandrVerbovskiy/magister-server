const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.USER_LISTING_FAVORITES,
    function (table) {
      table.increments("id").primary();
      table.timestamps(true, true);

      table
        .integer("listing_id")
        .unsigned()
        .references(STATIC.TABLES.LISTINGS + ".id");

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
  return knex.schema.dropTableIfExists(STATIC.TABLES.USER_LISTING_FAVORITES);
};
