const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.USER_VERIFY_REQUESTS,
    function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");
      table.boolean("has_response").defaultTo(false);
      table.boolean("viewed_failed_description").defaultTo(false);
      table.text("failed_description");
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.USER_VERIFY_REQUESTS);
};
