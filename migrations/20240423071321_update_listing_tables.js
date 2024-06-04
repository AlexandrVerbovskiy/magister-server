const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.LISTINGS, function (table) {
    table.boolean("active").defaultTo(true);

    table
      .integer("category_id")
      .unsigned()
      .references(STATIC.TABLES.LISTING_CATEGORIES + ".id")
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.LISTINGS, function (table) {
    table.dropColumn("active");
    table.dropForeign("category_id");
  });
};
