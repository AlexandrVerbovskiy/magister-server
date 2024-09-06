require("dotenv").config();
const STATIC = require("../static");

const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let password = process.env.CLIENT_ADMIN_PASSWORD;
  password = await bcrypt.hash(password, 10);

  await knex(STATIC.TABLES.USERS).insert([
    {
      name: process.env.CLIENT_ADMIN_NAME,
      email: process.env.CLIENT_ADMIN_EMAIL,
      password: password,
      email_verified: true,
      role: "admin",
      verified: true,
      accepted_term_condition: true,
      two_factor_authentication: false
    },
  ]);
};
