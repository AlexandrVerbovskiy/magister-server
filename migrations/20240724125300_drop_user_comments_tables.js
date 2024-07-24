const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.USER_COMMENTS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.USER_COMMENTS, function (table) {
    table.increments("id").primary();
    table.text("description");
    table.string("type");

    table.integer("quality");
    table.integer("listing_accuracy");
    table.integer("utility");
    table.integer("condition");
    table.integer("performance");
    table.integer("location");

    table.boolean("approved").defaultTo(false);
    table.boolean("waiting_admin").defaultTo(true);
    table.text("rejected_description");

    table.timestamps(true, true);

    table
      .integer("order_id")
      .unsigned()
      .references(STATIC.TABLES.ORDERS + ".id");
  });
};
