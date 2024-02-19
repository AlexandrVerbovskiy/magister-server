const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(STATIC.TABLES.SYSTEM, function (table) {
        table.increments("id").primary();
        table.text("key");
        table.text("value");
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.SYSTEM);
};
