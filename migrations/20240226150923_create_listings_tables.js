const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LISTINGS, function (table) {
    table.increments("id").primary();

    table.string("name");
    table.text("key_words");

    table.text("description");
    table.text("rental_terms");
    table.text("address");
    table.float("price");
    table.timestamp("finish_time");

    table.text("postcode");
    table.string("city");

    table.float("rental_lat");
    table.float("rental_lng");
    table.float("rental_radius");

    table.boolean("approved").defaultTo(false);

    table.timestamps(true, true);

    table
      .integer("category_id")
      .unsigned();

    table
      .integer("owner_id")
      .unsigned()
      .references(STATIC.TABLES.USERS + ".id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.LISTINGS);
};
