const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  /*return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.string("stripe_customer_id").defaultTo(null);
    table.string("stripe_card_id").defaultTo(null);
    table.string("credit_number").defaultTo(null);
    table.number("stripe_exp_month").defaultTo(null);
    table.number("stripe_exp_year").defaultTo(null);
  });*/
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  /*return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.dropColumn("stripe_customer_id");
    table.dropColumn("stripe_card_id");
    table.dropColumn("credit_number");
    table.dropColumn("stripe_exp_month");
    table.dropColumn("stripe_exp_year");
  });*/
};
