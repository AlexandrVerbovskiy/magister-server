const STATIC = require("../static");
const { timeConverter, getYesterdayDate, getTodayDate } = require("../utils");
const BaseController = require("./baseController");

class LogController extends BaseController {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      req.body.fromTime =
        req.body.fromTime ?? timeConverter(getYesterdayDate());
      req.body.toTime = req.body.toTime ?? timeConverter(getTodayDate());

      const { options, countItems } = await this.baseList(
        req,
        ({ filter, fromTime, toTime }) =>
          this.logModel.totalCount(filter, fromTime, toTime)
      );

      options["fromTime"] = req.body.fromTime;
      options["toTime"] = req.body.toTime;

      const logs = await this.logModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: logs,
        options,
        countItems,
      });
    });
  };

  getById = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      if (isNaN(id)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const log = await this.logModel.getById(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, log);
    });
  };
}

module.exports = new LogController();
