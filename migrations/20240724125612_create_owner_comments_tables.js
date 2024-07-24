const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.OWNER_COMMENTS,
    function (table) {
      table.increments("id").primary();
      table.text("description");
      table.text("leave_feedback");

      table.integer("item_description_accuracy");
      table.integer("photo_accuracy");
      table.integer("pickup_condition");
      table.integer("cleanliness");
      table.integer("responsiveness");
      table.integer("clarity");
      table.integer("scheduling_flexibility");
      table.integer("issue_resolution");

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
  return knex.schema.dropTableIfExists(STATIC.TABLES.OWNER_COMMENTS);
};
