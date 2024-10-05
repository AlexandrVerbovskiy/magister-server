const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
        table.float("worker_fee").nullable().defaultTo(null).alter();
        table.float("owner_fee").nullable().defaultTo(null).alter();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {    
        table.integer("worker_fee").nullable().defaultTo(null).alter();
        table.integer("owner_fee").nullable().defaultTo(null).alter();
      });
};
