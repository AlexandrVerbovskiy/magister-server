const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_IMAGES,
    function (table) {
      table.increments("id").primary();
      
      table.string("type");
      table.string("link");

      table
      .integer("listing_id")
      .unsigned()
      .references(STATIC.TABLES.LISTINGS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_IMAGES);
};
