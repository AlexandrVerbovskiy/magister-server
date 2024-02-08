const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.string("password").nullable().alter();
    table.boolean("need_set_password").defaultTo(false);
    table.boolean("need_regular_view_info_form").defaultTo(true);
    table.boolean("verified").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.string("password").notNullable().alter();
    table.dropColumn("need_set_password");
    table.dropColumn("need_regular_view_info_form");
    table.dropColumn("verified");
  });
};
