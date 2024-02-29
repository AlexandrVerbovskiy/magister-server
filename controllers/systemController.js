const STATIC = require("../static");
const Controller = require("./Controller");

class SystemController extends Controller {
  constructor() {
    super();
  }

  getUserLogActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const active = await this.systemOptionModel.getUserLogActive();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        active,
      });
    });

  setUserLogActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { active } = req.body;
      await this.systemOptionModel.setUserLogActive(active);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { active });
    });
}

module.exports = new SystemController();
