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
      key: "user_log_active",
      value: "true",
    },
  ]);
};
