const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LISTINGS, function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("category");
    table.text("rental_terms");
    table.text("location");
    table.text("description");
    table.string("photo").defaultTo("");
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
