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

    let { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.recipientPaymentModel.totalCount(filter, timeInfos, {
          userId,
          type: req.body.type,
          status: req.body.status,
        })
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    options["userId"] = userId;
    options["type"] = req.body.type;
    options["status"] = req.body.status;

    const requests = await this.recipientPaymentModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  userList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const result = await this.baseRecipientPaymentList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseRecipientPaymentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = new RecipientPaymentController();
