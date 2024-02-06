const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.dropColumn("social_media_links");
    table.dropColumn("linkedin");
    table.dropColumn("facebook");

    table.text("facebook_url").nullable().defaultTo(null);
    table.text("twitter_url").nullable().defaultTo(null);
    table.text("linkedin_url").nullable().defaultTo(null);
    table.text("instagram_url").nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(STATIC.TABLES.USERS, function (table) {
    table.text("social_media_links").nullable().defaultTo(null);
    table.string("linkedin").nullable().defaultTo(null);
    table.string("facebook").nullable().defaultTo(null);

    table.dropColumn("facebook_url");
    table.dropColumn("twitter_url");
    table.dropColumn("linkedin_url");
    table.dropColumn("instagram_url");
  });
};
