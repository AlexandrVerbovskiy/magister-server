const STATIC = require("../static");
const Controller = require("./Controller");

class SystemController extends Controller {
  constructor() {
    super();
  }

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
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      } = req.body;

      await this.systemOptionModel.setOptions({
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
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

module.exports = new SystemController();
