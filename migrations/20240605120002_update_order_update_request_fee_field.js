const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDER_UPDATE_REQUESTS, function (table) {
    table.float("fee").nullable().defaultTo(null).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDER_UPDATE_REQUESTS, function (table) {
    table.integer("fee").nullable().defaultTo(null).alter();
  });
};
