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
      table.string("payed_proof").nullable().defaultTo(null);
      table.string("type").nullable().defaultTo(null);
      table.json("data").nullable().defaultTo(null);
      table.boolean("admin_approved").defaultTo(false);
      table.boolean("waiting_approved").defaultTo(true);
      table.text("failed_description");
      table.timestamp("due_at").nullable().defaultTo(null);
      table.boolean("hidden").defaultTo(false);
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
