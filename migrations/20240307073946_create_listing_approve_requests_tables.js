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
      table.text("reject_description").nullable().defaultTo(null);
      table.boolean("approved").nullable().defaultTo(null);
      table.timestamps(true, true);

      table
        .integer("listing_id")
        .unsigned()
        .references(STATIC.TABLES.LISTINGS + ".id");
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
