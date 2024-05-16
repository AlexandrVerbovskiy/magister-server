const STATIC = require("../static");
const Controller = require("./Controller");

class LogController extends Controller {
  constructor() {
    super();
  }

  baseLogList = async (req) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    let { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) => this.logModel.totalCount(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await this.logModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getById = (req, res) => this.baseGetById(req, res, this.logModel);
}

module.exports = new LogController();
