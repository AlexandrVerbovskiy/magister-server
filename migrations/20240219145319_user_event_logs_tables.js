const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable(STATIC.TABLES.USER_EVENT_LOGS, function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned();
    table.text("user_email");
    table.text("user_role");
    table.string("event_name");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.USER_EVENT_LOGS);
};
