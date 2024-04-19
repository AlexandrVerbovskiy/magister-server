const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.ORDERS, function (table) {
    table.increments("id").primary();

    table.integer("tenant_id").unsigned();
    table.integer("listing_id").unsigned();
    table.float("price_per_day");
    table.string("start_date");
    table.string("end_date");
    table.string("accept_listing_qr_code");
    table.integer("fee");
    table.integer("duration");
    table.float("fact_total_price");

    table.enum("status", Object.values(STATIC.ORDER_STATUSES));
    table.enum("cancel_status", Object.values(STATIC.ORDER_CANCELATION_STATUSES));
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ORDERS);
};
