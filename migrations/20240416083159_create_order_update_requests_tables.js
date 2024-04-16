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

      table.integer("order_id").unsigned();
      table.integer("listing_id").unsigned();
      table.date("new_start_date");
      table.date("new_end_date");

      table.enum(
        "status",
        Object.values(STATIC.ORDER_UPDATE_REQUEST_RECIPIENTS)
      );
      table.boolean("active").defaultTo(true);

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
