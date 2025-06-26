const STATIC = require("../static");
const Controller = require("./Controller");

class SystemController extends Controller {
  getSystemOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const props = await this.systemOptionModel.getOptions();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, props);
    });

  setSystemCommissionOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
<<<<<<< HEAD
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
=======
        renterBaseCommissionPercent,
        renterCancelFeePercent,
>>>>>>> fad5f76 (start)
      } = req.body;

      await this.systemOptionModel.setOptions({
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
<<<<<<< HEAD
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
=======
        renterBaseCommissionPercent,
        renterCancelFeePercent,
>>>>>>> fad5f76 (start)
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
<<<<<<< HEAD
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
=======
        renterBaseCommissionPercent,
        renterCancelFeePercent,
>>>>>>> fad5f76 (start)
      });
    });

  setMainCommissionOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userLogActive } = req.body;

      await this.systemOptionModel.setOptions({
        userLogActive,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        userLogActive,
      });
    });

  setSystemBankAccountInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        bankAccountIban,
        bankAccountSwiftBic,
        bankAccountBeneficiary,
        bankAccountReferenceConceptCode,
      } = req.body;

      await this.systemOptionModel.setOptions({
        bankAccountIban,
        bankAccountSwiftBic,
        bankAccountBeneficiary,
        bankAccountReferenceConceptCode,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        bankAccountIban,
        bankAccountSwiftBic,
        bankAccountBeneficiary,
        bankAccountReferenceConceptCode,
      });
    });
}

module.exports = SystemController;
