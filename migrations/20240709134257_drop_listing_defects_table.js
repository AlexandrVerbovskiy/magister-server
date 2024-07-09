const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_DEFECTS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.createTable(STATIC.TABLES.LISTING_DEFECTS, function (table) {
        table.increments("id").primary();
        table.string("name");
        table.integer("order_index").nullable().defaultTo(null);
        table.timestamps(true, true);
      });
};
