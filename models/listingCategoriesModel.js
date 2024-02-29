require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;

class ListingCategoriesModel extends Model {
  visibleFields = ["id", "name", "level", "parent_id as parentId", "popular"];

  listGroupedByLevel = async () => {
    const list = await db(LISTING_CATEGORIES_TABLE)
      .orderBy("id", "desc")
      .select(this.visibleFields);

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

  deleteList = async (ids) => {
    await db(LISTING_CATEGORIES_TABLE).whereIn("id", ids).delete();
  };

  listByName = async (name) => {
    const list = await db(LISTING_CATEGORIES_TABLE)
      .where("name", "like", `%${name}%`)
      .orderBy("popular", "desc")
      .orderBy("level", "asc")
      .select(["name"])
      .limit(20);

    return list.map((elem) => elem.name);
  };

  popularList = async () => {
    const list = await db(LISTING_CATEGORIES_TABLE)
      .where("popular", true)
      .orderBy("level", "asc")
      .select(["name"])
      .limit(20);

    return list.map((elem) => elem.name);
  };

  getById = (id) => this.baseGetById(id, LISTING_CATEGORIES_TABLE);
}

module.exports = new ListingCategoriesModel();
