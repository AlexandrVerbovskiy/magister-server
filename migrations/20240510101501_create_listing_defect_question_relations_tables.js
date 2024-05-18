const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.LISTING_DEFECT_QUESTION_RELATIONS,
    function (table) {
      table.increments("id").primary();
      table.text("question");
      table.text("description");
      table.boolean("answer");
      table.string("type");
      table
        .integer("order_id")
        .unsigned()
        .references(STATIC.TABLES.ORDERS + ".id");
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(
    STATIC.TABLES.LISTING_DEFECT_QUESTION_RELATIONS
  );
};
