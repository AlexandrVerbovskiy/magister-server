require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LISTING_DEFECTS_TABLE = STATIC.TABLES.LISTING_DEFECTS;

class ListingDefectModel extends Model {
  visibleFields = ["id", "name", "order_index as orderIndex"];

  getAll = async () => {
    await db(LISTING_DEFECTS_TABLE).select(this.visibleFields);
  };

  create = async ({name, orderIndex}) => {
    await db(LISTING_DEFECTS_TABLE).insert({
      name,
      order_index: orderIndex,
    });
  };

  update = async ({name, orderIndex}, id) => {
    await db(LISTING_DEFECTS_TABLE).where({ id }).update({
      name,
      order_index: orderIndex,
    });
  };

  checkNameUnique = async (name) => {
    const defect = await db(LISTING_DEFECTS_TABLE).where({ name }).first();
    return !defect;
  };

  deleteList = async (ids) => {
    await db(LISTING_DEFECTS_TABLE).whereIn("id", ids).delete();
  };
}

module.exports = new ListingDefectModel();
