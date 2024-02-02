const knex = require("knex");
const config = require("./knexfile");

const db = knex(config);

db.migrate
  .latest()
  .then(function () {
    console.log("Migrations complete.");
  })
  .catch(function (err) {
    console.error("Error running migrations:", err);
  })
  .finally(function () {
    db.destroy();
  });
