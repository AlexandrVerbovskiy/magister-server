const STATIC = require("../static");

function getEntityAlterCheckValue(obj) {
  const values = Object.values(obj);
  return values.map((value) => `'${value}'`).join(", ");
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
      knex.raw("ALTER TABLE ?? ALTER COLUMN status TYPE TEXT", [
        STATIC.TABLES.ORDERS,
      ]);

      table.string("cancel_status").nullable().defaultTo(null).alter();
    }),
    knex.schema.raw(
      `ALTER TABLE ${STATIC.TABLES.ORDERS} DROP CONSTRAINT IF EXISTS ${STATIC.TABLES.ORDERS}_status_check;`
    ),
    knex.schema.raw(
      `ALTER TABLE ${STATIC.TABLES.ORDERS} DROP CONSTRAINT IF EXISTS ${STATIC.TABLES.ORDERS}_cancel_status_check;`
    ),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.ORDERS, function (table) {
      table.string("status").alter();
      table.string("cancel_status").nullable().defaultTo(null).alter();
    }),
    knex.raw(
      `ALTER TABLE ${STATIC.TABLES.ORDERS} ADD CONSTRAINT ${STATIC.TABLES.ORDERS}_status_check CHECK (status IN (${getEntityAlterCheckValue(
        STATIC.ORDER_STATUSES
      )}))`
    ),
    knex.raw(
      `ALTER TABLE ${STATIC.TABLES.ORDERS} ADD CONSTRAINT ${STATIC.TABLES.ORDERS}_cancel_status_check CHECK (status IN (${getEntityAlterCheckValue(
        STATIC.ORDER_CANCELATION_STATUSES
      )}, null))`
    ),
  ]);
};
