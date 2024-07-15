const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table(STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS, function (table) {
    table.boolean("sent_success").defaultTo(false);
    table.timestamp("sent_at").nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS, function (table) {
    table.dropColumn("sent_success");
    table.dropColumn("sent_at");
  });
};
