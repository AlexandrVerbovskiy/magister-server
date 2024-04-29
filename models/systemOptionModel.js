require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SYSTEM_TABLE = STATIC.TABLES.SYSTEM;

class SystemOptionModel extends Model {
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

  getOwnerBaseCommissionPercent = async () => {
    const value = await this.getByKey("owner_base_commission_percent");
    return value ? Number(value) : 0;
  };

  getOwnerBoostCommissionPercent = async () => {
    const value = await this.getByKey("owner_boost_commission_percent");
    return value ? Number(value) : 0;
  };

  getTenantBaseCommissionPercent = async () => {
    const value = await this.getByKey("tenant_base_commission_percent");
    return value ? Number(value) : 0;
  };

  getCommissionInfo = async () => {
    const commissions = await db(SYSTEM_TABLE).whereIn("key", [
      "owner_base_commission_percent",
      "owner_boost_commission_percent",
      "tenant_base_commission_percent",
    ]);

    const ownerBaseCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "owner_base_commission_percent"
    );
    const ownerBoostCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "owner_boost_commission_percent"
    );
    const tenantBaseCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "tenant_base_commission_percent"
    );

    const result = {
      ownerBaseCommissionPercent: ownerBaseCommissionPercentInfo
        ? Number(ownerBaseCommissionPercentInfo.value)
        : 0,
      ownerBoostCommissionPercent: ownerBoostCommissionPercentInfo
        ? Number(ownerBoostCommissionPercentInfo.value)
        : 0,
      tenantBaseCommissionPercent: tenantBaseCommissionPercentInfo
        ? Number(tenantBaseCommissionPercentInfo.value)
        : 0,
    };

    return result;
  };

  getOptions = async () => {
    const resObj = {};
    const res = await db(SYSTEM_TABLE).select("key", "value");
    res.forEach((row) => (resObj[row["key"]] = row["value"]));

    const userLogActive = resObj["user_log_active"]
      ? resObj["user_log_active"] === "true"
      : true;

    const ownerBaseCommissionPercent =
      resObj["owner_base_commission_percent"] ?? "";
    const ownerBoostCommissionPercent =
      resObj["owner_boost_commission_percent"] ?? "";
    const tenantBaseCommissionPercent =
      resObj["tenant_base_commission_percent"] ?? "";

    return {
      userLogActive,
      ownerBaseCommissionPercent,
      ownerBoostCommissionPercent,
      tenantBaseCommissionPercent,
    };
  };

  setOptions = async ({
    userLogActive,
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
  }) => {
    const userLogActiveStringValue = userLogActive ? "true" : "false";

    await this.updateByKey("user_log_active", userLogActiveStringValue);
    await this.updateByKey(
      "owner_base_commission_percent",
      ownerBaseCommissionPercent
    );
    await this.updateByKey(
      "owner_boost_commission_percent",
      ownerBoostCommissionPercent
    );
    await this.updateByKey(
      "tenant_base_commission_percent",
      tenantBaseCommissionPercent
    );
  };
}

module.exports = new SystemOptionModel();
