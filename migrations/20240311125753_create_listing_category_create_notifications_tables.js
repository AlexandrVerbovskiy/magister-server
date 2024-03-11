const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS,
    function (table) {
      table.increments("id").primary();
      table.integer("user_id").unsigned();
      table.text("category_name");
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(
    STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS
  );
};
