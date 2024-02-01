const knex = require("knex");
const config = require("./knexfile");

const db = knex(config);

db.migrate
  .latest()
  .then(function () {
    return db.seed.run();
  })
  .then(function () {
    console.log("Migrations and seeds complete.");
  })
  .catch(function (err) {
    console.error("Error running migrations:", err);
  })
  .finally(function () {
    db.destroy();
  });
