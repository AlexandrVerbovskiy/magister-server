const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.CHECKLISTS, function (table) {
    table.increments("id").primary();
    table.text("item_matches_description");
    table.text("item_matches_photos");
    table.text("item_fully_functional");
    table.text("parts_good_condition");
    table.text("provided_guidelines");
    table.string("type");

    table
      .integer("order_id")
      .unsigned()
      .references(STATIC.TABLES.ORDERS + ".id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.CHECKLISTS);
};
