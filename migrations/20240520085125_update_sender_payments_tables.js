const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.renameColumn("paypal_order_id", "payed_proof");
      table.string("type").nullable().defaultTo(null);
      table.json("data").nullable().defaultTo(null);
      table.boolean("admin_approved").defaultTo(false);
      table.boolean("waiting_approved").defaultTo(true);
      table.text("failed_description").nullable().defaultTo(null);
      table.dropColumn("paypal_sender_id");
      table.dropColumn("paypal_order_id");
      table.dropColumn("paypal_capture_id");
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
      table.renameColumn("payed_proof", "paypal_order_id");
      table.dropColumn("type");
      table.dropColumn("data");
      table.dropColumn("admin_approved");
      table.dropColumn("waiting_approved");
      table.dropColumn("failed_description");
      table.string("paypal_sender_id").nullable().defaultTo(null);
      table.string("paypal_order_id").nullable().defaultTo(null);
      table.string("paypal_capture_id").nullable().defaultTo(null);
    }
  );
};
