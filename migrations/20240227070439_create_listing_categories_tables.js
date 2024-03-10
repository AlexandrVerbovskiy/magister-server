const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_CATEGORIES,
    function (table) {
      table.increments("id").primary();

      table.string("name");
      table.integer("level");
      table.string("image").nullable().defaultTo(null);
      table.integer("parent_id").unsigned().nullable().defaultTo(null);
      table.boolean("popular").defaultTo(false);

      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_CATEGORIES);
};
