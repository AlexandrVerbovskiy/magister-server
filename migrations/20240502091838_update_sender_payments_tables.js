const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.string("paypal_sender_id").nullable().defaultTo(null);
      table.string("paypal_order_id").nullable().defaultTo(null);
      table.string("paypal_capture_id").nullable().defaultTo(null);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.dropColumn("paypal_sender_id");
      table.dropColumn("paypal_order_id");
      table.dropColumn("paypal_capture_id");
    }
  );
};
