const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.RECIPIENT_PAYMENTS,
    function (table) {
      table.dropColumn("paypal_id");
      table.string("type");
      table.json("data").nullable().defaultTo(null);
      table.text("failed_description");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.RECIPIENT_PAYMENTS,
    function (table) {
      table.string("paypal_id");
      table.dropColumn("type");
      table.dropColumn("data");
      table.dropColumn("failed_description");
    }
  );
};
