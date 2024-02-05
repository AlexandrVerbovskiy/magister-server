const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    STATIC.TABLES.USER_DOCUMENTS,
    function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references(STATIC.TABLES.USERS + ".id");
      table.string("proof_of_address_link").nullable().defaultTo(null);
      table.string("reputable_bank_id_link").nullable().defaultTo(null);
      table.string("utility_link").nullable().defaultTo(null);
      table.string("hmrc_link").nullable().defaultTo(null);
      table.string("council_tax_bill_link").nullable().defaultTo(null);
      table.string("passport_or_driving_id_link").nullable().defaultTo(null);
      table
        .string("confirm_money_laundering_checks_and_compliance_link")
        .nullable()
        .defaultTo(null);
      table.timestamps(true, true);
    }
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(STATIC.TABLES.USER_DOCUMENTS);
};
