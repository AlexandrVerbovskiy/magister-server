const { orderModel } = require("../models");

const main = async () => {
  await orderModel.updateExtendedFinished();
  process.exit();
};

main();
