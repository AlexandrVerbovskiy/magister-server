const STATIC = require("../static");
const BaseController = require("./baseController");

class UserEventLogController extends BaseController {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, ({ filter }) =>
        this.userEventLogModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
      );

      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const logs = await this.userEventLogModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: logs,
        options,
        countItems,
      });
    });
  };
}

module.exports = new UserEventLogController();
