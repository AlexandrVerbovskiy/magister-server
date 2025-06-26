const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.ORDERS, function (table) {
    table.increments("id").primary();

    table.text("status");
    table.string("cancel_status").nullable().defaultTo(null);

    table.float("price");
    table.timestamp("start_time");
    table.timestamp("finish_time");

    table.float("prev_price").nullable().defaultTo(null);
    table.timestamp("prev_start_time").nullable().defaultTo(null);
    table.timestamp("prev_finish_time").nullable().defaultTo(null);

    table.float("renter_fee").nullable().defaultTo(null);
    table.float("owner_fee").nullable().defaultTo(null);
    table.timestamp("finished_at").nullable().defaultTo(null);
    table.timestamps(true, true);

    table
      .integer("renter_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id");

    table
      .integer("listing_id")
      .unsigned()
      .references(STATIC.TABLES.LISTINGS + ".id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ORDERS);
};
