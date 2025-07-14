const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.DISPUTE_PREDICTION_MODELS,
    function (table) {
      table.increments("id").primary();
      table.integer("accuracy").nullable().defaultTo(null);

      table.boolean("active").defaultTo(false);
      table.boolean("after_finish_active").defaultTo(false);
      table.boolean("after_finish_rebuild").defaultTo(false);
      table.boolean("started").defaultTo(false);
      table.boolean("stopped").defaultTo(false);
      table.boolean("finished").defaultTo(false);

      table.json("body");
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.DISPUTE_PREDICTION_MODELS);
};
