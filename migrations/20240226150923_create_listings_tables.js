const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.LISTINGS, function (table) {
    table.increments("id").primary();
    table.string("name");

    table.text("description");
    table.text("address");
    table.float("total_price");
    table.timestamp("finish_time");

    table.text("postcode");
    table.string("city");

    table.float("lat");
    table.float("lng");
    table.float("radius");

    table.string("other_category").defaultTo(null);
    table.string("background_photo").defaultTo(null);
    table.boolean("approved").defaultTo(false);

    table.integer("category_id").unsigned().nullable();
    table.integer("other_category_parent_id").defaultTo(null);

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
