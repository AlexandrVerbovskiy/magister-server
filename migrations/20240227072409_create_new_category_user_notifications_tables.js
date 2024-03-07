const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(STATIC.TABLES.NEW_CATEGORY_USER_NOTIFICATION, function (table) {
        table.increments("id").primary();
        
        table.integer("user_id").unsigned();
        table.string("value");
        table.boolean("sent").defaultTo(false);

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.NEW_CATEGORY_USER_NOTIFICATION);
};
