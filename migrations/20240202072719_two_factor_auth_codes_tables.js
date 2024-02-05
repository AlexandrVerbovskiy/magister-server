const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.TWO_FACTOR_AUTH_CODES, function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned();
    table.string("code");
    table.enum("type_verification", ["email", "phone"]).defaultTo("email");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(STATIC.TABLES.TWO_FACTOR_AUTH_CODES);
};
