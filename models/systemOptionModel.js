require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");

const SYSTEM_TABLE = STATIC.TABLES.SYSTEM;

class SystemOptionModel {
  getByKey = async (key) => {
    const res = await db(SYSTEM_TABLE).where("key", key).first();
    return res["value"];
  };

  updateByKey = async (key, newValue) => {
    await db(SYSTEM_TABLE).where("key", key).update({ value: newValue });
  };

  getUserLogActive = async () => {
    const value = await this.getByKey("user_log_active");
    return value === "true";
  };

  setUserLogActive = async (value) => {
    const stringValue = value ? "true" : "false";
    await this.updateByKey("user_log_active", stringValue);
  };
}

module.exports = new SystemOptionModel();