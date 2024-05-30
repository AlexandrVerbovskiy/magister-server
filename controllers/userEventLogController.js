const STATIC = require("../static");
const Controller = require("./Controller");

class UserEventLogController extends Controller {
  constructor() {
    super();
  }

  baseUserEventLogList = async (req) => {
    const timeInfos = await this.listTimeNameOption(req);

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.userEventLogModel.totalCount(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const logs = await this.userEventLogModel.list(options);

    return {
      items: logs,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseUserEventLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = new UserEventLogController();
