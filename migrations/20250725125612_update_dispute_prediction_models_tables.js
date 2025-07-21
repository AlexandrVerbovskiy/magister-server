const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.DISPUTE_PREDICTION_MODELS, function (table) {
      table.boolean("checked").defaultTo(false);
      table.string("check_field");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable(STATIC.TABLES.DISPUTE_PREDICTION_MODELS, function (table) {
      table.dropColumn("checked");
      table.dropColumn("check_field")
  });
};
