require("dotenv").config();
const STATIC = require("../static");

const dataToInsert = [
  {
    image: "womens_clothing.png",
    imageMimeType: "image/png",
    name: "Women's Clothing",
    children: [
      { name: "Dresses" },
      { name: "Skirts" },
      { name: "Blouses" },
      { name: "Pants" },
      { name: "Jumpsuits" },
      { name: "Outerwear" },
      { name: "Suits" },
    ],
  },
  {
    image: "mens_clothing.png",
    imageMimeType: "image/png",
    name: "Men's Clothing",
    children: [
      { name: "Shirts" },
      { name: "Pants" },
      { name: "Suits" },
      { name: "Blazers" },
      { name: "T-shirts" },
      { name: "Outerwear" },
    ],
  },
  {
    image: "kids_clothing.png",
    imageMimeType: "image/png",
    name: "Kids' Clothing",
    children: [
      { name: "Rompers & Onesies" },
      { name: "Dresses" },
      { name: "Pants" },
      { name: "Sweaters" },
      { name: "Jackets" },
    ],
  },
  {
    image: "unisex_clothing.webp",
    imageMimeType: "image/png",
    name: "Unisex Clothing",
    children: [
      { name: "T-shirts" },
      { name: "Sweatshirts" },
      { name: "Tracksuits" },
    ],
  },
  {
    image: "accessories.png",
    imageMimeType: "image/png",
    name: "Accessories",
    children: [
      { name: "Bags" },
      { name: "Hats & Beanies" },
      { name: "Jewelry" },
      { name: "Belts" },
      { name: "Sunglasses" },
    ],
  },
  {
    image: "footwear.webp",
    imageMimeType: "image/png",
    name: "Footwear",
    children: [
      { name: "Shoes" },
      { name: "Boots" },
      { name: "Sneakers" },
      { name: "Sandals" },
      { name: "Ankle Boots" },
    ],
  },
];

const getCategoryByNameLevel = async (knex, name, level, parentId = null) =>
  await knex(STATIC.TABLES.LISTING_CATEGORIES)
    .whereRaw("LOWER(name) = ?", [name.toLowerCase()])
    .where("level", level)
    .where("parent_id", parentId)
    .select("id")
    .first();

const createCategoryByLevel = async (
  knex,
  { name, image },
  level,
  parentId = null
) =>
  await knex(STATIC.TABLES.LISTING_CATEGORIES).returning("id").insert({
    name: name,
    level: level,
    parent_id: parentId,
    image: image,
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  for (let i = 0; i < dataToInsert.length; i++) {
    const selectCategory = await getCategoryByNameLevel(
      knex,
      dataToInsert[i].name,
      1
    );

    let selectCategoryId = selectCategory?.id;
    let bindChildWithoutChecking = false;
    const parentImage = dataToInsert[i].image
      ? `static/base_listing_categories/${dataToInsert[i].image}`
      : null;

    if (!selectCategoryId) {
      const result = await createCategoryByLevel(
        knex,
        {
          name: dataToInsert[i].name,
          image: parentImage,
        },
        1
      );

      selectCategoryId = result[0]["id"];
      bindChildWithoutChecking = true;
    }

    if (bindChildWithoutChecking) {
      const childCategoriesToInsert = [];

      dataToInsert[i].children.forEach((childCategory) =>
        childCategoriesToInsert.push({
          name: childCategory.name,
          image: parentImage,
          level: 2,
          parent_id: selectCategoryId,
        })
      );

      await knex(STATIC.TABLES.LISTING_CATEGORIES).insert(
        childCategoriesToInsert
      );
    } else {
      for (let j = 0; j < dataToInsert[i].children.length; j++) {
        const childCategory = await getCategoryByNameLevel(
          knex,
          dataToInsert[i].children[j].name,
          2,
          selectCategoryId
        );

        if (!childCategory) {
          await createCategoryByLevel(
            knex,
            { name: dataToInsert[i].children[j].name, image: null },
            2,
            selectCategoryId
          );
        }
      }
    }
  }
};
