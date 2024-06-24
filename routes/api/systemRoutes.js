const { Router } = require("express");
const router = Router();
const { SystemController } = require("../../controllers");
const {
  setCommissionOptionsValidation,
  setMainOptionsValidation,
  setSystemBankAccountInfoValidation,
} = require("../../validations/system");

module.exports = (io) => {
  const systemController = new SystemController(io);

  router.get("/get-system-options", systemController.getSystemOptions);

  router.post(
    "/set-system-commission-options",
    setCommissionOptionsValidation,
    systemController.setSystemCommissionOptions
  );

  router.post(
    "/set-system-bank-account-options",
    setSystemBankAccountInfoValidation,
    systemController.setSystemBankAccountInfo
  );

  router.post(
    "/set-system-main-options",
    setMainOptionsValidation,
    systemController.setMainCommissionOptions
  );

  return router;
};
