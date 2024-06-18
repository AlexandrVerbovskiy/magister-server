const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.SOCKETS, function (table) {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id");

    table.text("socket");

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.SOCKETS);
};
