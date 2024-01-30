/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("email_verified_tokens", function (table) {
        table.increments("id").primary();
        table.integer("user_id").unsigned();
        table.string("token");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("email_verified_tokens");
};
