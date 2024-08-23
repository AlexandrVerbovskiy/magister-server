const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.CHECKLIST_PHOTOS,
    function (table) {
      table.increments("id").primary();
      table.string("link");
      table
        .integer("checklist_id")
        .unsigned()
        .references(STATIC.TABLES.CHECKLISTS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.CHECKLIST_PHOTOS);
};
