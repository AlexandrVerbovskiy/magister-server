require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const ACTIVE_ACTION_TABLE = STATIC.TABLES.ACTIVE_ACTIONS;

class ActiveAction extends Model {
  create = async (userId, type, key, data) => {
    const result = await db(ACTIVE_ACTION_TABLE)
      .insert({
        type,
        user_id: userId,
        key,
        data,
      })
      .returning("id");

    const actionId = result[0]["id"];
    return await this.getById(actionId);
  };

  deleteById = async (id) => {
    await db(ACTIVE_ACTION_TABLE).where({ id }).delete();
  };

  deleteByKeyAndType = async (key, type) => {
    await db(ACTIVE_ACTION_TABLE).where({ key, type }).delete();
  };

  getByKeyAndType = async (key, type) => {
    const actions = await db(ACTIVE_ACTION_TABLE)
      .select("data")
      .where({ key, type });

    return actions[0];
  };

  getById = async (id) => {
    const actions = await db(ACTIVE_ACTION_TABLE).select("data").where({ id });
    return actions[0];
  };

  getUserActions = async (userId) => {
    const actions = await db(ACTIVE_ACTION_TABLE)
      .select("id", "user_id as userId", "type", "data", "key")
      .where({ user_id: userId });

    return actions;
  };
}

module.exports = new ActiveAction();
