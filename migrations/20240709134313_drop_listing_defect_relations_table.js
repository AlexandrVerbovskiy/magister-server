const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists(STATIC.TABLES.LISTING_DEFECT_RELATIONS);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.createTable(
        STATIC.TABLES.LISTING_DEFECT_RELATIONS,
        function (table) {
          table.increments("id").primary();
          table.timestamps(true, true);
    
          table
            .integer("listing_id")
            .unsigned()
            .references(STATIC.TABLES.LISTINGS + ".id");
          table
            .integer("listing_defect_id")
            .unsigned()
            .references(STATIC.TABLES.LISTING_DEFECTS + ".id");
        }
      );
};
