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
      table.text("category_name");
      table.timestamps(true, true);

      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");

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
