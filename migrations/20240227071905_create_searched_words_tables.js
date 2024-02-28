const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.SEARCHED_WORDS,
    function (table) {
      table.increments("id").primary();

      table.string("name");
      table
        .integer("listing_categories_id")
        .unsigned()
        .nullable()
        .defaultTo(null);
      table.boolean("admin_viewed").defaultTo(false);
      table.integer("search_count").defaultTo(1);

      table.timestamps();
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.SEARCHED_WORDS);
};
