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
      table.boolean("active").defaultTo(true);
      table.float("new_price");
      table.timestamp("new_start_time");
      table.timestamp("new_finish_time");

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
