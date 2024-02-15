const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.dropColumn("need_set_password");
    table.boolean("has_password_access").defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.boolean("need_set_password").defaultTo(false);
    table.dropColumn("has_password_access");
  });
};
