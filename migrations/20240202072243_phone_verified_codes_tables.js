/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("phone_verified_codes", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned();
    table.string("code");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("phone_verified_codes");
};
