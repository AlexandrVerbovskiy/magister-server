const STATIC = require("../static");
const Controller = require("./Controller");

class UserEventLogController extends Controller {
  constructor() {
    super();
  }

  baseUserEventLogList = async (req) => {
    const timeInfos = await this.listTimeNameOption(req);
    const type = req.body.type ?? "all";
    const filter = req.body.filter ?? "";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.userEventLogModel.totalCount({ filter, timeInfos, type })
    );

    options = this.addTimeInfoToOptions(options, timeInfos);
    options["type"] = type;

    const logs = await this.userEventLogModel.list(options);

    const typeCount = await this.userEventLogModel.getTypesCount({
      filter,
      timeInfos,
    });

    return {
      items: logs,
      options,
      countItems,
      typeCount
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseUserEventLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = new UserEventLogController();
