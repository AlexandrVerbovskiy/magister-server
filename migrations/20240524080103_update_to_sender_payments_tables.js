const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.timestamp("due_at").nullable().defaultTo(null);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.dropColumns("due_at");
    }
  );
};
