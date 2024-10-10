const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.USER_DOCUMENTS,
    function (table) {
      table.increments("id").primary();
      table.string("user_photo").nullable().defaultTo(null);
      table.string("document_front").nullable().defaultTo(null);
      table.string("document_back").nullable().defaultTo(null);
      table.timestamps(true, true);

      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.USER_DOCUMENTS);
};
