const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.RECIPIENT_PAYMENTS,
    function (table) {
      table.increments("id").primary();

      table.float("money");
      table.string("planned_time");
      table.string("received_type");
      table.string("status");
      table.string("paypal_id");
      table.text("failed_details");
      table.timestamp("last_tried_at").nullable().defaultTo(null);

      table.timestamps(true, true);

      table
        .integer("user_id")
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
  return knex.schema.dropTableIfExists(STATIC.TABLES.RECIPIENT_PAYMENTS);
};
