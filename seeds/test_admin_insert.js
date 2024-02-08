require("dotenv").config();
const STATIC = require("../static");

const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let password = "Test1@gmail.com";
  password = await bcrypt.hash(password, 10);

  await knex(STATIC.TABLES.USERS).insert([
    {
      name: "test",
      email: "Test1@gmail.com",
      password: password,
      email_verified: true,
      role: "admin",
      verified: true,
      accepted_term_condition: true,
      two_factor_authentication: false,
    },
  ]);
};
