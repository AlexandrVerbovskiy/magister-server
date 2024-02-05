const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(STATIC.TABLES.USERS, function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("email");
    table.boolean("email_verified").defaultTo(false);
    table.string("password");
    table.enum("role", ["admin", "support", "user"]).defaultTo("user");

    table.text("contact_details").defaultTo("");
    table.text("brief_bio").defaultTo("");
    table.string("photo").defaultTo("");

    //1.4 Document Submission
    //1.5 Address Verification

    table.string("phone").nullable().defaultTo(null);
    table.boolean("phone_verified").defaultTo(false);

    table.string("linkedin").nullable().defaultTo(null);
    table.string("facebook").nullable().defaultTo(null);

    //1.8 Background Check (Optional)

    table.boolean("two_factor_authentication").defaultTo(true);

    table.boolean("accepted_term_condition").defaultTo(false);
    table.boolean("active").defaultTo(false);

    table.boolean("suspicious").defaultTo(false);
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
