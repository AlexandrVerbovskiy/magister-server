require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const SYSTEM_TABLE = STATIC.TABLES.SYSTEM;

class SystemOptionModel extends Model {
  getByKey = async (key) => {
    const res = await db(SYSTEM_TABLE).where("key", key).first();
    return res?.["value"];
  };

  updateByKey = async (key, newValue) => {
    const existingRow = await db(SYSTEM_TABLE).where("key", key).first();

    if (existingRow) {
      await db(SYSTEM_TABLE).where("key", key).update({ value: newValue });
    } else {
      await db(SYSTEM_TABLE).insert({ key: key, value: newValue });
    }
  };

  getUserLogActive = async () => {
    const value = await this.getByKey("user_log_active");
    return value === "true";
  };

  getOwnerBaseCommissionPercent = async () => {
    const value = await this.getByKey("owner_base_commission_percent");
    return value ? Number(value) : 0;
  };

  getBankAccountInfo = async () => {
    const bankAccountInfos = await db(SYSTEM_TABLE).whereIn("key", [
      "bank_account_iban",
      "bank_account_swift_bic",
      "bank_account_beneficiary",
      "bank_account_reference_concept_code",
    ]);
    const bankAccountIban = bankAccountInfos.find(
      (info) => info.key == "bank_account_iban"
    );

    const bankAccountSwiftBic = bankAccountInfos.find(
      (info) => info.key == "bank_account_swift_bic"
    );

    const bankAccountBeneficiary = bankAccountInfos.find(
      (info) => info.key == "bank_account_beneficiary"
    );

    const bankAccountReferenceConceptCode = bankAccountInfos.find(
      (info) => info.key == "bank_account_reference_concept_code"
    );

    const result = {
      bankAccountIban: bankAccountIban?.value?? "",
      bankAccountSwiftBic: bankAccountSwiftBic?.value?? "",
      bankAccountBeneficiary: bankAccountBeneficiary?.value?? "",
      bankAccountReferenceConceptCode: bankAccountReferenceConceptCode?.value?? "",
    };

    return result;
  };

  getOwnerBoostCommissionPercent = async () => {
    const value = await this.getByKey("owner_boost_commission_percent");
    return value ? Number(value) : 0;
  };

  getRenterBaseCommissionPercent = async () => {
    const value = await this.getByKey("renter_base_commission_percent");
    return value ? Number(value) : 0;
  };

  getRenterCancelCommissionPercent = async () => {
    const value = await this.getByKey("renter_cancel_fee_percent");
    return value ? Number(value) : 0;
  };

  getCommissionInfo = async () => {
    const commissions = await db(SYSTEM_TABLE).whereIn("key", [
      "owner_base_commission_percent",
      "owner_boost_commission_percent",
      "renter_base_commission_percent",
      "renter_cancel_fee_percent",
    ]);

    const ownerBaseCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "owner_base_commission_percent"
    );

    const ownerBoostCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "owner_boost_commission_percent"
    );

    const renterBaseCommissionPercentInfo = commissions.find(
      (commission) => commission.key == "renter_base_commission_percent"
    );

    const renterCancelFeePercentInfo = commissions.find(
      (commission) => commission.key == "renter_cancel_fee_percent"
    );

    const result = {
      ownerBaseCommissionPercent: ownerBaseCommissionPercentInfo
        ? Number(ownerBaseCommissionPercentInfo.value)
        : 0,
      ownerBoostCommissionPercent: ownerBoostCommissionPercentInfo
        ? Number(ownerBoostCommissionPercentInfo.value)
        : 0,
      renterBaseCommissionPercent: renterBaseCommissionPercentInfo
        ? Number(renterBaseCommissionPercentInfo.value)
        : 0,
      renterCancelFeePercent: renterCancelFeePercentInfo
        ? Number(renterCancelFeePercentInfo.value)
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
    const renterBaseCommissionPercent =
      resObj["renter_base_commission_percent"] ?? "";
    const renterCancelFeePercent = resObj["renter_cancel_fee_percent"] ?? "";
    const bankAccountIban = resObj["bank_account_iban"] ?? "";
    const bankAccountSwiftBic = resObj["bank_account_swift_bic"] ?? "";
    const bankAccountBeneficiary = resObj["bank_account_beneficiary"] ?? "";
    const bankAccountReferenceConceptCode =
      resObj["bank_account_reference_concept_code"] ?? "";

    return {
      userLogActive,
      ownerBaseCommissionPercent,
      ownerBoostCommissionPercent,
      renterBaseCommissionPercent,
      renterCancelFeePercent,
      bankAccountIban,
      bankAccountSwiftBic,
      bankAccountBeneficiary,
      bankAccountReferenceConceptCode,
    };
  };

  setOptions = async ({
    userLogActive = null,
    ownerBaseCommissionPercent = null,
    ownerBoostCommissionPercent = null,
    renterBaseCommissionPercent = null,
    renterCancelFeePercent = null,
    bankAccountIban = null,
    bankAccountSwiftBic = null,
    bankAccountBeneficiary = null,
    bankAccountReferenceConceptCode = null,
  }) => {
    if (userLogActive !== null) {
      const userLogActiveStringValue = userLogActive ? "true" : "false";
      await this.updateByKey("user_log_active", userLogActiveStringValue);
    }

    if (ownerBaseCommissionPercent !== null) {
      await this.updateByKey(
        "owner_base_commission_percent",
        ownerBaseCommissionPercent
      );
    }

    if (ownerBoostCommissionPercent !== null) {
      await this.updateByKey(
        "owner_boost_commission_percent",
        ownerBoostCommissionPercent
      );
    }

    if (renterBaseCommissionPercent !== null) {
      await this.updateByKey(
        "renter_base_commission_percent",
        renterBaseCommissionPercent
      );
    }

    if (renterCancelFeePercent !== null) {
      await this.updateByKey(
        "renter_cancel_fee_percent",
        renterCancelFeePercent
      );
    }

    if (bankAccountIban !== null) {
      await this.updateByKey("bank_account_iban", bankAccountIban);
    }

    if (bankAccountSwiftBic !== null) {
      await this.updateByKey("bank_account_swift_bic", bankAccountSwiftBic);
    }

    if (bankAccountSwiftBic !== null) {
      await this.updateByKey(
        "bank_account_beneficiary",
        bankAccountBeneficiary
      );
    }

    if (bankAccountReferenceConceptCode !== null) {
      await this.updateByKey(
        "bank_account_reference_concept_code",
        bankAccountReferenceConceptCode
      );
    }
  };
}

module.exports = new SystemOptionModel();
