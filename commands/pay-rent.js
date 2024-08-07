const { CronCommandController } = require("../controllers");
const cronCommandController = new CronCommandController(null);

const main = async () => {
  await cronCommandController.basePayRentForOwners();
  process.exit();
};

main();
