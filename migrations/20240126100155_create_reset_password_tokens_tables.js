const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(STATIC.TABLES.RESET_PASSWORD_TOKENS, function (table) {
        table.increments("id").primary();
        table.integer("user_id").unsigned();
        table.string("token");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(STATIC.TABLES.RESET_PASSWORD_TOKENS);
};
