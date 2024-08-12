const { Router } = require("express");
const router = Router();
const { CronCommandController } = require("../../controllers");

module.exports = () => {
  const cronCommandController = new CronCommandController(null);
  router.post("/pay-rent-for-owners", cronCommandController.payRentForOwners);
  router.post("/reset-database", cronCommandController.resetDatabase);
  router.post("/email-test", cronCommandController.emailTest);
  return router;
};
