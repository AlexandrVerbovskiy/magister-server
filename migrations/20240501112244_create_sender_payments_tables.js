const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.SENDER_PAYMENTS,
    function (table) {
      table.increments("id").primary();
      table.float("money");
      table.timestamps(true, true);

      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");

      table
        .integer("order_id")
        .unsigned()
        .references(STATIC.TABLES.ORDERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.SENDER_PAYMENTS);
};
