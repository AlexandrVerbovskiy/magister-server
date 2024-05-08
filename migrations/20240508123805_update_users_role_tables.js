const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
      table.string("role").defaultTo("user").alter();
    }),
    knex.schema.raw(
      `ALTER TABLE ${STATIC.TABLES.USERS} DROP CONSTRAINT IF EXISTS ${STATIC.TABLES.USERS}_role_check;`
    ),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
      table.string("role").defaultTo("user").alter();
    }),
    knex.raw(
      `ALTER TABLE ${STATIC.TABLES.USERS} ADD CONSTRAINT ${
        STATIC.TABLES.USERS
      }_role_check CHECK (role IN ('admin', 'support', 'user'))`
    ),
  ]);
};
