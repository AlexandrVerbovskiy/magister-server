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
    table.date("start_date");
    table.date("end_date");
    table.string("accept_listing_qr_code");

    table.enum("status", Object.values(STATIC.ORDER_STATUSES));
    table.boolean("closed").defaultTo(false);

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
