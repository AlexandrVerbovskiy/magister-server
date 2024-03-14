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
    table.integer("owner_id").unsigned();
    table.text("key_words");

    table.float("compensation_cost");
    table.integer("count_stored_items");
    table.float("price_per_day");
    table.integer("min_rental_days").nullable().defaultTo(null);

    table.text("description");
    table.text("rental_terms");
    table.text("address");

    table.text("postcode");
    table.string("city");

    table.string("rental_lat");
    table.string("rental_lng");
    table.float("rental_radius");

    table.boolean("approved").defaultTo(false);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTINGS);
};
