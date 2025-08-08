const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.DISPUTE_PREDICTION_MODELS,
    function (table) {
      table.integer("progress_percent").defaultTo(0);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.DISPUTE_PREDICTION_MODELS,
    function (table) {
      table.dropColumn("progress_percent");
    }
  );
};
