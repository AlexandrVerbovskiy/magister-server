const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.dropColumn("place_work");
    table.dropColumn("twitter_url");
    table.dropColumn("contact_details");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.text("place_work");
    table.text("twitter_url");
    table.text("contact_details");
  });
};
