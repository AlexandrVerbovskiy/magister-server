require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SEARCHED_WORDS_TABLE = STATIC.TABLES.SEARCHED_WORDS;

class SearchedWord extends Model {
  visibleFields = [
    "id",
    "name",
    "listing_categories_id as listingCategoriesId",
    "admin_viewed as adminViewed",
    "search_count as searchCount",
  ];

  strFilterFields = ["name"];

  orderFields = ["id", "name", "search_count"];

  getSearchCountByName = async (name) => {
    const foundRes = await db(SEARCHED_WORDS_TABLE)
      .where({ name })
      .select(this.visibleFields);

    if (foundRes[0]) return foundRes[0]["searchCount"];
    return null;
  };

  updateSearchCount = async (name) => {
    const searchedCount = await this.getSearchCountByName(name);

    if (searchedCount) {
      await db(SEARCHED_WORDS_TABLE)
        .where({ name })
        .update({ search_count: searchedCount + 1 });
    } else {
      await db(SEARCHED_WORDS_TABLE).insert({ name });
    }
  };

  changeViewed = async (id, viewed) => {
    await db(SEARCHED_WORDS_TABLE)
      .where({ id })
      .update({ admin_viewed: viewed });
  };

  setCategoryId = async (id, categoryId) => {
    await db(SEARCHED_WORDS_TABLE)
      .where({ id })
      .update({ listing_categories_id: categoryId });
  };

  setCategoryByName = async (name, categoryId) => {
    await db(SEARCHED_WORDS_TABLE)
      .where({ name })
      .update({ listing_categories_id: categoryId });
  };

  unsetCategoryList = async (categoryIds) => {
    await db(SEARCHED_WORDS_TABLE)
      .whereIn("listing_categories_id", categoryIds)
      .update({ listing_categories_id: null });
  };

  getListInfoQueryUpdate = (accepted, viewed, query) => {
    if (accepted == "no") {
      query = query.whereNull("listing_categories_id");
    }

    if (accepted == "yes") {
      query = query.whereNotNull("listing_categories_id");
    }

    if (viewed == "no") {
      query = query.where("admin_viewed", false);
    }

    if (viewed == "yes") {
      query = query.where("admin_viewed", true);
    }

    return query;
  };

  totalCount = async (filter, accepted, viewed) => {
    let query = db(SEARCHED_WORDS_TABLE).whereRaw(
      ...this.baseStrFilter(filter)
    );

    query = this.getListInfoQueryUpdate(accepted, viewed, query);

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);
    const { accepted, viewed } = props;

    let query = db(SEARCHED_WORDS_TABLE)
      .select(this.visibleFields)
      .whereRaw(...this.baseStrFilter(filter));

    query = this.getListInfoQueryUpdate(accepted, viewed, query);

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  getById = async (id) => {
    await this.changeViewed(id, true);
    return await this.baseGetById(id, SEARCHED_WORDS_TABLE);
  };
}

module.exports = new SearchedWord();
