const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.ORDERS, function (table) {
    table.increments("id").primary();
    table.float("price_per_day");
    table.string("start_date");
    table.string("end_date");
    table.string("accept_listing_qr_code");
    table.integer("fee");

    table.float("prev_price_per_day").nullable().defaultTo(null);
    table.string("prev_start_date").nullable().defaultTo(null);
    table.string("prev_end_date").nullable().defaultTo(null);

    table.text("status");
    table.string("cancel_status").nullable().defaultTo(null);
    table.boolean("fee_active");

    table.float("worker_fee").nullable().defaultTo(null);
    table.float("owner_fee").nullable().defaultTo(null);
    table.timestamp("finished_at").nullable().defaultTo(null);
    table.timestamps(true, true);

    table
      .integer("worker_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id");

    table
      .integer("listing_id")
      .unsigned()
      .references(STATIC.TABLES.LISTINGS + ".id");

    table
      .integer("parent_id")
      .unsigned()
      .nullable()
      .defaultTo(null)
      .references(STATIC.TABLES.ORDERS + ".id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ORDERS);
};
