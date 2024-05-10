require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LISTING_CATEGORIES_TABLE = STATIC.TABLES.LISTING_CATEGORIES;
const LISTING_TABLE = STATIC.TABLES.LISTINGS;

class ListingCategoryModel extends Model {
  modelFields = [
    "id",
    "name",
    "level",
    "image",
    "parent_id as parentId",
    "popular",
    "order_index as orderIndex",
  ];

  visibleFields = [
    `${LISTING_CATEGORIES_TABLE}.id`,
    `${LISTING_CATEGORIES_TABLE}.name`,
    "level",
    `${LISTING_CATEGORIES_TABLE}.image`,
    "parent_id as parentId",
    "popular",
    "order_index as orderIndex",
  ];

  groupCategoriesByLevel = (categories) => {
    const res = {
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
    };

    categories.forEach((category) => {
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

  listGroupedByLevel = async () => {
    const categories = await db(LISTING_CATEGORIES_TABLE)
      .orderBy("id", "desc")
      .select(this.visibleFields);

    return this.groupCategoriesByLevel(categories);
  };

  checkNameUnique = async (name, level) => {
    const category = await db(LISTING_CATEGORIES_TABLE)
      .where({ name, level })
      .first();

    return !category;
  };

  create = async ({
    name,
    level,
    orderIndex,
    image = null,
    parentId = null,
    popular = false,
  }) => {
    const res = await db(LISTING_CATEGORIES_TABLE)
      .insert({
        name,
        level,
        parent_id: parentId,
        popular,
        image,
        order_index: orderIndex,
      })
      .returning("id");

    return res[0]["id"];
  };

  update = async ({
    id,
    name,
    image = null,
    level,
    orderIndex,
    parentId = null,
    popular = false,
  }) => {
    await db(LISTING_CATEGORIES_TABLE).where({ id }).update({
      name,
      level,
      image,
      parent_id: parentId,
      popular,
      order_index: orderIndex,
    });
  };

  deleteList = async (ids) => {
    await db(LISTING_CATEGORIES_TABLE).whereIn("id", ids).delete();
  };

  listByName = async (name) => {
    const list = await db(LISTING_CATEGORIES_TABLE)
      .where("name", "like", `%${name}%`)
      .whereIn("level", [2, 3])
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

  getRecursiveCategoryList = async (categoryId) => {
    const categoriesWithParents = await db.raw(
      `WITH RECURSIVE bfs_categories AS (
        SELECT ${this.modelFields.join(", ")}
        FROM ${LISTING_CATEGORIES_TABLE}
        WHERE id = ?
        UNION
        SELECT ${this.modelFields.map((field) => `c.${field}`).join(", ")}
        FROM ${LISTING_CATEGORIES_TABLE} c
        JOIN bfs_categories bc ON c.id = parentId
      )
      SELECT * FROM bfs_categories;`,
      [categoryId]
    );
    return categoriesWithParents.rows;
  };

  getFullInfoList = async () => {
    const categories = await db(LISTING_CATEGORIES_TABLE)
      .select([
        ...this.visibleFields,
        db.raw(`COALESCE(COUNT(${LISTING_TABLE}.id), 0) as "countListings"`),
      ])
      .leftJoin(LISTING_TABLE, function () {
        this.on(
          `${LISTING_TABLE}.category_id`,
          "=",
          `${LISTING_CATEGORIES_TABLE}.id`
        ).andOnVal(`${LISTING_TABLE}.approved`, true);
      })
      .groupBy([
        `${LISTING_CATEGORIES_TABLE}.id`,
        `${LISTING_CATEGORIES_TABLE}.name`,
        "level",
        `${LISTING_CATEGORIES_TABLE}.image`,
        "parent_id",
        "popular",
      ])
      .orderBy(db.raw(`COALESCE(COUNT(${LISTING_TABLE}.id), 0)`), "desc");

    return this.groupCategoriesByLevel(categories);
  };

  getById = (id) => this.baseGetById(id, LISTING_CATEGORIES_TABLE);

  getByName = async (category) => {
    return await db(LISTING_CATEGORIES_TABLE)
      .whereRaw("LOWER(name) = ?", [category.toLowerCase()])
      .select(this.visibleFields)
      .first();
  };
}

module.exports = new ListingCategoryModel();
