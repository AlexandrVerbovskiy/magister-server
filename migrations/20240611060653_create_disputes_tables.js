const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.DISPUTES, function (table) {
    table.increments("id").primary();
    table.text("solution");
    table.text("description");
    table.string("type");
    table.string("status");
    table.timestamp("solved_at").nullable().defaultTo(null);
    table.timestamps(true, true);

    table
      .integer("order_id")
      .unsigned()
      .references(STATIC.TABLES.ORDERS + ".id")
      .unique();

    table
      .integer("sender_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.DISPUTES);
};
