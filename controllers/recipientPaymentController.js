const STATIC = require("../static");
const Controller = require("./Controller");

class RecipientPaymentController extends Controller {
  constructor() {
    super();
  }

  baseRecipientPaymentList = async (req, userId = null) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.recipientPaymentModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"],
          userId
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    options["userId"] = userId;

    const requests = await this.recipientPaymentModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const result = await this.baseRecipientPaymentList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = new RecipientPaymentController();
