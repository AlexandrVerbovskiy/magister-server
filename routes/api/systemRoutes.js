const { Router } = require("express");
const router = Router();
const { systemController } = require("../../controllers");
const {
  setCommissionOptionsValidation,
  setMainOptionsValidation,
  setSystemBankAccountInfoValidation,
} = require("../../validations/system");

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

module.exports = router;
