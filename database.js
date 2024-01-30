const pgp = require("pg-promise")();

const name = process.env.DB_USER_NAME;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const connectionString = `postgres://${name}:${password}@${host}:${port}/${database}`;
const db = pgp(connectionString);

module.exports = db;
