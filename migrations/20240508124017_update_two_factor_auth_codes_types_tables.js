const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable(
      STATIC.TABLES.TWO_FACTOR_AUTH_CODES,
      function (table) {
        table.string("type_verification").defaultTo("email").alter();
      }
    ),
    knex.schema.raw(
      `ALTER TABLE ${STATIC.TABLES.TWO_FACTOR_AUTH_CODES} DROP CONSTRAINT IF EXISTS ${STATIC.TABLES.TWO_FACTOR_AUTH_CODES}_type_verification_check;`
    ),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable(
      STATIC.TABLES.TWO_FACTOR_AUTH_CODES,
      function (table) {
        table.string("type_verification").defaultTo("email").alter();
      }
    ),
    knex.raw(
      `ALTER TABLE ${STATIC.TABLES.TWO_FACTOR_AUTH_CODES} ADD CONSTRAINT ${STATIC.TABLES.TWO_FACTOR_AUTH_CODES}_type_verification_check CHECK (type_verification IN ('email', 'phone'))`
    ),
  ]);
};
