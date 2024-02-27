const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(STATIC.TABLES.SEARCHED_WORDS, function (table) {
        table.increments("id").primary();
        
        table.string("name");
        table.boolean("accepted").defaultTo(false);
        table.boolean("viewed").defaultTo(false);

        table.timestamps();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.SEARCHED_WORDS);
};
