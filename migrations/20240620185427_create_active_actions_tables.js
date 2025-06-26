const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.ACTIVE_ACTIONS,
    function (table) {
      table.increments("id").primary().notNullable();
      table.text("type").notNullable();
      table.text("data");
      table.text("key");

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references(STATIC.TABLES.ORDERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.ACTIVE_ACTIONS);
};
