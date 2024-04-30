const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.string("tenant_accept_listing_token").defaultTo(null);
    table.text("tenant_accept_listing_qrcode");
    table.dropColumn("accept_listing_qr_code");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.dropColumn("tenant_accept_listing_token");
    table.dropColumn("tenant_accept_listing_qrcode");
    table.string("accept_listing_qr_code");
  });
};
