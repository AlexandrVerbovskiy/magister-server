const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.ORDER_UPDATE_REQUESTS,
    function (table) {
      table.increments("id").primary();
      table.string("new_start_date");
      table.string("new_end_date");
      table.float("new_price_per_day");
      table.boolean("active").defaultTo(true);
      table.float("fee").defaultTo(null);
      table.integer("new_duration");
      table.float("fact_total_price");
      table.timestamps(true, true);

      table
        .integer("sender_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");

      table
        .integer("order_id")
        .unsigned()
        .references(STATIC.TABLES.ORDERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ORDER_UPDATE_REQUESTS);
};
