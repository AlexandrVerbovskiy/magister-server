const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USER_DOCUMENTS, function (table) {
    table.dropColumn("proof_of_address_link");
    table.dropColumn("reputable_bank_id_link");
    table.dropColumn("utility_link");
    table.dropColumn("hmrc_link");
    table.dropColumn("council_tax_bill_link");
    table.dropColumn("passport_or_driving_id_link");
    table.dropColumn("confirm_money_laundering_checks_and_compliance_link");
    table.string("user_photo").nullable().defaultTo(null);
    table.string("document_front").nullable().defaultTo(null);
    table.string("document_back").nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USER_DOCUMENTS, function (table) {
    table.dropColumn("user_photo");
    table.dropColumn("document_front");
    table.dropColumn("document_back");
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
  });
};
