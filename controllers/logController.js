const STATIC = require("../static");
const Controller = require("./Controller");

class LogController extends Controller {
  constructor() {
    super();
  }

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, ({ filter }) =>
        this.logModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
      );

      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const requests = await this.logModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: requests,
        options,
        countItems,
      });
    });

  getById = (req, res) => this.baseGetById(req, res, this.logModel);
}

module.exports = new LogController();
