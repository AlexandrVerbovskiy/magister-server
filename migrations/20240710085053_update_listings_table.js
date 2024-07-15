const STATIC = require("../static");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table(STATIC.TABLES.LISTINGS, function (table) {
      table.string("other_category").defaultTo(null);
      table.dropForeign("category_id");
    })
    .then(function () {
      return knex.schema.alterTable(STATIC.TABLES.LISTINGS, function (table) {
        table.integer("category_id").unsigned().nullable().alter();
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const firstCategory = await knex(STATIC.TABLES.LISTING_CATEGORIES).first();

  if (!firstCategory) {
    throw new Error("No categories found in categories table");
  }

  const defaultCategoryId = firstCategory.id;

  // Оновлюємо значення NULL до значення першої категорії
  await knex(STATIC.TABLES.LISTINGS).whereNull("category_id").update({
    category_id: defaultCategoryId,
  });

  return await knex.schema
    .alterTable(STATIC.TABLES.LISTINGS, function (table) {
      table.dropColumn("other_category");
      table.integer("category_id").unsigned().notNullable().alter();
    })
    .then(function () {
      return knex.schema.table(STATIC.TABLES.LISTINGS, function (table) {
        table
          .foreign("category_id")
          .references(STATIC.TABLES.LISTING_CATEGORIES + ".id");
      });
    });
};
