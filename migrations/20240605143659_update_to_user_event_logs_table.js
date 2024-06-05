const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.USER_EVENT_LOGS,
    function (table) {
      table.text("event_name").alter();
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.USER_EVENT_LOGS,
    function (table) {
      table.string("event_name").alter();
    }
  );
};
