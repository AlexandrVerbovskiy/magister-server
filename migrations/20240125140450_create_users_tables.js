const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.USERS, function (table) {
    table.increments("id").primary();
    table.string("name");
    table.text("email").unique();
    table.boolean("email_verified").defaultTo(false);
    table.string("password").nullable();
    table.string("role").defaultTo("user");

    table.text("brief_bio").defaultTo("");
    table.string("photo").defaultTo("");

    table.string("phone").nullable().defaultTo(null);
    table.boolean("phone_verified").defaultTo(false);

    table.boolean("need_regular_view_info_form").defaultTo(true);
    table.boolean("verified").defaultTo(false);

    table.boolean("two_factor_authentication").defaultTo(false);

    table.boolean("accepted_term_condition").defaultTo(false);
    table.boolean("active").defaultTo(true);

    table.boolean("suspicious").defaultTo(false);
    table.boolean("online");

    table.text("facebook_url");
    table.text("linkedin_url");
    table.text("instagram_url");
    table.string("paypal_id").defaultTo(null);

    table.boolean("has_password_access").defaultTo(true);
    table.boolean("deleted").defaultTo(false);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(STATIC.TABLES.USERS);
};
