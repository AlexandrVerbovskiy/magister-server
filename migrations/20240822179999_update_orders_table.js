const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.dropColumn("defect_description_by_tenant");
    table.dropColumn("defect_description_by_owner");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
    table.text("defect_description_by_tenant");
    table.text("defect_description_by_owner");
  });
};
