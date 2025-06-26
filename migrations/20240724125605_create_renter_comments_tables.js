const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.RENTER_COMMENTS,
    function (table) {
      table.increments("id").primary();
      table.text("description");
      table.text("leave_feedback");

      table.integer("care");
      table.integer("timeliness");
      table.integer("responsiveness");
      table.integer("clarity");
      table.integer("usage_guidelines");
      table.integer("terms_of_service");
      table.integer("honesty");
      table.integer("reliability");
      table.integer("satisfaction");

      table.boolean("approved").defaultTo(false);
      table.boolean("waiting_admin").defaultTo(true);
      table.text("rejected_description");
      table.timestamps(true, true);

      table
        .integer("order_id")
        .unsigned()
        .references(STATIC.TABLES.ORDERS + ".id");
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.RENTER_COMMENTS);
};
