const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(
    STATIC.TABLES.DISPUTE_PREDICTION_MODELS,
    function (table) {
      table.json("prediction_details");
      table.json("selected_fields");
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
      table.dropColumn("prediction_details");
      table.dropColumn("selected_fields");
    }
  );
};
