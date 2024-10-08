require("dotenv").config();

module.exports = {
  client: "pg",
  connection: {
    user: process.env.DB_USER_NAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  pool: {
    afterCreate: function(connection, callback) {
      connection.query('SET TIME ZONE \'Europe/Kiev\';', function(err) {
        callback(err, connection);
      });
    }
  }
};
