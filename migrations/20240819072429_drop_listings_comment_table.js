const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_COMMENTS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_COMMENTS,
    function (table) {
      table.increments("id").primary();
      table.text("description");

      table.integer("punctuality");
      table.integer("communication");
      table.integer("flexibility");
      table.integer("reliability");
      table.integer("kindness");
      table.integer("general_experience");

      table.boolean("approved").defaultTo(false);
      table.boolean("waiting_admin").defaultTo(true);
      table.text("rejected_description");

      table.timestamps(true, true);

      table
        .integer("order_id")
        .unsigned()
        .references(STATIC.TABLES.ORDERS + ".id");
    }
  );
};
