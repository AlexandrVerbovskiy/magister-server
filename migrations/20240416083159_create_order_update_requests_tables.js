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

      table.integer("sender_id").unsigned();
      table.integer("order_id").unsigned();
      table.date("new_start_date");
      table.date("new_end_date");
      table.float("new_price_per_day");
      table.boolean("active").defaultTo(true);
      table.integer("fee");
      table.integer("new_duration");
      table.float("fact_total_price");
      
      table.timestamps(true, true);
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
