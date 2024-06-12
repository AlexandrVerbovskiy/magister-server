const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.LISTING_IMAGES, function (table) {
      table
        .foreign("listing_id")
        .references("id")
        .inTable(STATIC.TABLES.LISTINGS);
    }),
    knex.schema.alterTable(
      STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS,
      function (table) {
        table.foreign("user_id").references("id").inTable(STATIC.TABLES.USERS);
      }
    ),
    knex.schema.alterTable(
      STATIC.TABLES.PHONE_VERIFIED_CODES,
      function (table) {
        table.foreign("user_id").references("id").inTable(STATIC.TABLES.USERS);
      }
    ),
    knex.schema.alterTable(
      STATIC.TABLES.TWO_FACTOR_AUTH_CODES,
      function (table) {
        table.foreign("user_id").references("id").inTable(STATIC.TABLES.USERS);
      }
    ),
    knex.schema.alterTable(STATIC.TABLES.SEARCHED_WORDS, function (table) {
      table
        .foreign("listing_categories_id")
        .references("id")
        .inTable(STATIC.TABLES.LISTING_CATEGORIES);
    }),
    knex.schema.alterTable(STATIC.TABLES.USER_EVENT_LOGS, function (table) {
      table.foreign("user_id").references("id").inTable(STATIC.TABLES.USERS);
    }),
    knex.schema.alterTable(STATIC.TABLES.LISTING_CATEGORIES, function (table) {
      table
        .foreign("parent_id")
        .references("id")
        .inTable(STATIC.TABLES.LISTING_CATEGORIES);
    }),
    knex.schema.alterTable(
      STATIC.TABLES.LISTING_APPROVAL_REQUESTS,
      function (table) {
        table
          .foreign("listing_id")
          .references("id")
          .inTable(STATIC.TABLES.LISTINGS);
      }
    ),
    knex.schema.alterTable(
      STATIC.TABLES.ORDER_UPDATE_REQUESTS,
      function (table) {
        table
          .foreign("order_id")
          .references("id")
          .inTable(STATIC.TABLES.ORDERS);

        table
          .foreign("sender_id")
          .references("id")
          .inTable(STATIC.TABLES.USERS);
      }
    ),

    knex.schema.alterTable(STATIC.TABLES.LISTINGS, function (table) {
      table.foreign("owner_id").references("id").inTable(STATIC.TABLES.USERS);
      table
        .foreign("category_id")
        .references("id")
        .inTable(STATIC.TABLES.LISTING_CATEGORIES);
    }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable(STATIC.TABLES.LISTING_IMAGES, function (table) {
      table.dropForeign("listing_id");
    }),
    knex.schema.alterTable(
      STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS,
      function (table) {
        table.dropForeign("user_id");
      }
    ),
    knex.schema.alterTable(
      STATIC.TABLES.PHONE_VERIFIED_CODES,
      function (table) {
        table.dropForeign("user_id");
      }
    ),
    knex.schema.alterTable(
      STATIC.TABLES.TWO_FACTOR_AUTH_CODES,
      function (table) {
        table.dropForeign("user_id");
      }
    ),
    knex.schema.alterTable(STATIC.TABLES.SEARCHED_WORDS, function (table) {
      table.dropForeign("listing_categories_id");
    }),
    knex.schema.alterTable(STATIC.TABLES.USER_EVENT_LOGS, function (table) {
      table.dropForeign("user_id");
    }),
    knex.schema.alterTable(
      STATIC.TABLES.LISTING_APPROVAL_REQUESTS,
      function (table) {
        table.dropForeign("listing_id");
      }
    ),
    knex.schema.alterTable(STATIC.TABLES.LISTING_CATEGORIES, function (table) {
      table.dropForeign("parent_id");
    }),
    knex.schema.alterTable(
      STATIC.TABLES.ORDER_UPDATE_REQUESTS,
      function (table) {
        table.dropForeign("order_id");
        table.dropForeign("sender_id");
      }
    ),
    knex.schema.alterTable(STATIC.TABLES.LISTINGS, function (table) {
        table.dropForeign("owner_id");
        table.dropForeign("category_id");
      }),
  ]);
};
