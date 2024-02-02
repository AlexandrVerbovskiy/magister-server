require("dotenv").config();
const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let password = process.env.ADMIN_PASSWORD;
  password = await bcrypt.hash(password, 10);

  await knex("users").insert([
    {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: password,
      email_verified: true,
      role: "admin",
    },
  ]);
};
