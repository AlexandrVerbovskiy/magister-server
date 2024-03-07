const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_APPROVAL_REQUESTS,
    function (table) {
      table.increments("id").primary();
      table.integer("listing_id").unsigned();
      table.text("reject_description").nullable().defaultTo(null);
      table.boolean("approved").nullable().defaultTo(null);
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_APPROVAL_REQUESTS);
};
