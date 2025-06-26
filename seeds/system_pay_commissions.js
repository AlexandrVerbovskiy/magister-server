require("dotenv").config();
const STATIC = require("../static");

const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex(STATIC.TABLES.SYSTEM).insert([
    {
      key: "owner_base_commission_percent",
      value: "15",
    },
    {
      key: "owner_boost_commission_percent",
      value: "20",
    },
    {
<<<<<<< HEAD
      key: "tenant_base_commission_percent",
=======
      key: "renter_base_commission_percent",
>>>>>>> fad5f76 (start)
      value: "15",
    },
  ]);
};
