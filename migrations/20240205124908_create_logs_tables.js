const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LOGS, function (table) {
    table.increments("id").primary();
    table.boolean("success").defaultTo(false);
    table.text("message");
    table.text("body");
    table.string("line").nullable().defaultTo(null);
    table.string("symbol").nullable().defaultTo(null);
    table.string("file").nullable().defaultTo(null);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LOGS);
};
