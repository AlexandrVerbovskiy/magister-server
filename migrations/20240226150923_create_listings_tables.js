const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LISTINGS, function (table) {
    table.increments("id").primary();
    table.string("name");

    table.float("compensation_cost");
    table.integer("count_stored_items");
    table.float("price_per_day");
    table.integer("min_rental_days").nullable().defaultTo(null);

    table.text("description");
    table.text("address");

    table.text("postcode");
    table.string("city");

    table.float("rental_lat");
    table.float("rental_lng");
    table.float("rental_radius");

    table.string("other_category").defaultTo(null);
    table.string("background_photo").defaultTo(null);
    table.boolean("approved").defaultTo(false);

    table.integer("category_id").unsigned().nullable();
    table.integer("other_category_parent_id").defaultTo(null);
    table.text("defects");

    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);

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
