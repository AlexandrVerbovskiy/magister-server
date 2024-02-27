const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LISTINGS, function (table) {
    table.increments("id").primary();
    
    table.string("name");
    table.integer("category_id").unsigned();
    table.float("compensation_cost");
    table.integer("count_stored_items");
    table.text("description");
    table.text("postcode");
    table.string("country");
    table.float("price_per_day");
    table.integer("min_rental_days");
    table.float("rental_radius");
    table.text("rental_terms");

    table.boolean("approved").defaultTo(false);;

    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTINGS);
};
