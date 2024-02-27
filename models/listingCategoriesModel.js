require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");

const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class ListingCategoriesModel {
  visibleFields = [
    `${LISTING_CATEGORIES_TABLE}.id`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    `${LISTING_CATEGORIES_TABLE}.level`,
    `${LISTING_CATEGORIES_TABLE}.parent_id as parentId`,
    `${LISTING_CATEGORIES_TABLE}.popular`,
  ];

  listGroupedByLevel = async () => {
    const list = await db(LISTING_CATEGORIES_TABLE)
      .leftJoin(
        `${LISTING_CATEGORIES_TABLE} as parent`,
        "parent.id",
        "=",
        `${LISTING_CATEGORIES_TABLE}.parent_id`
      )
      .select([...this.visibleFields, "parent.name as parentName"]);

    const res = {
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
    };

    list.forEach((category) => {
      if (category.level == 1) {
        res.firstLevel.push(category);
      } else if (category.level == 2) {
        res.secondLevel.push(category);
      } else {
        res.thirdLevel.push(category);
      }
    });

    return res;
  };

  checkNameUnique = async (name, level) => {
    const category = await db(LISTING_CATEGORIES_TABLE)
      .where({ name, level })
      .first();

    return !category;
  };

  create = async ({ name, level, parentId = null, popular = false }) => {
    const res = await db(LISTING_CATEGORIES_TABLE)
      .insert({
        name,
        level,
        parent_id: parentId,
        popular,
      })
      .returning("id");

    return res[0]["id"];
  };

  update = async ({ id, name, level, parentId = null, popular = false }) => {
    await db(LISTING_CATEGORIES_TABLE).where({ id }).update({
      name,
      level,
      parent_id: parentId,
      popular,
    });
  };

  deleteList = async (ids, level) => {
    await db(LISTING_CATEGORIES_TABLE).where({ level }).whereIn("id", ids).delete();
  };
}

module.exports = new ListingCategoriesModel();
