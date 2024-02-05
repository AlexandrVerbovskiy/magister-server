const knex = require("knex");
const config = require("./knexfile");
const fs = require("fs");
const path = require("path");
const STATIC = require("./static")

const db = knex(config);

const runSeeds = async () => {
  const seedsPath = path.join(__dirname, "seeds");
  const seedFileNames = fs.readdirSync(seedsPath);

  for (const seed of seedFileNames) {
    const seedAlreadyRun = await checkSeedStatus(seed);

    if (!seedAlreadyRun) {
      await db.seed.run({ specific: seed });
      await markSeedAsRun(seed);
    } else {
      console.log(`Seed ${seed} was already run.`);
    }
  }

  await db.destroy();
  console.log(`Seed complete`);
};

const checkSeedStatus = async (seedName) => {
  const result = await db(STATIC.TABLES.SEED_STATUS)
    .select("seed_run")
    .where("seed_name", seedName)
    .first();
  return result && result.seed_run;
};

const markSeedAsRun = async (seedName) => {
  await db(STATIC.TABLES.SEED_STATUS)
    .insert({ seed_name: seedName, seed_run: true })
    .onConflict("seed_name")
    .merge();
};

runSeeds();
