const STATIC = require("../static");
const Controller = require("./Controller");

class SystemController extends Controller {
  constructor() {
    super();
  }

  getSystemOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        userLogActive,
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      } = await this.systemOptionModel.getOptions();

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        userLogActive,
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      });
    });

  setSystemOptions = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        userLogActive,
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      } = req.body;

      await this.systemOptionModel.setOptions({
        userLogActive,
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        userLogActive,
        ownerBaseCommissionPercent,
        ownerBoostCommissionPercent,
        tenantBaseCommissionPercent,
        tenantCancelFeePercent,
      });
    });
}

module.exports = new SystemController();
