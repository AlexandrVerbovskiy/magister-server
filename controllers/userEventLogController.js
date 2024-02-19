const STATIC = require("../static");
const { timeConverter, getYesterdayDate, getTodayDate } = require("../utils");
const BaseController = require("./baseController");

class UserEventLogController extends BaseController {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      req.body.fromTime =
        req.body.fromTime ?? timeConverter(getYesterdayDate());
      req.body.toTime = req.body.toTime ?? timeConverter(getTodayDate());

      const { options, countItems } = await this.baseListOptions(
        req,
        ({ filter, fromTime, toTime }) =>
          this.userEventLogModel.totalCount(filter, fromTime, toTime)
      );

      options["fromTime"] = req.body.fromTime;
      options["toTime"] = req.body.toTime;

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