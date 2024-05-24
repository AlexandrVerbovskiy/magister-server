const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table
      .integer("parent_id")
      .unsigned()
      .nullable()
      .defaultTo(null)
      .references(STATIC.TABLES.ORDERS + ".id");
    table.timestamp("finished_at").nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.dropColumns("parent_id");
    table.dropColumns("finished_at");
  });
};
