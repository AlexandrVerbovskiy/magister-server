const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.dropColumns("fact_total_price");
    table.dropColumns("duration");

    table.float("prev_price_per_day").nullable().defaultTo(null);
    table.string("prev_start_date").nullable().defaultTo(null);
    table.string("prev_end_date").nullable().defaultTo(null);

    table.integer("tenant_fee").nullable().defaultTo(null);
    table.integer("owner_fee").nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.float("fact_total_price");
    table.integer("duration");

    table.dropColumn("prev_price_per_day");
    table.dropColumn("prev_start_date");
    table.dropColumn("prev_end_date");

    table.dropColumn("tenant_fee");
    table.dropColumn("owner_fee");
  });
};
