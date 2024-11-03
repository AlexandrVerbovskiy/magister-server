const STATIC = require("../static");
const Controller = require("./Controller");

class RecipientPaymentController extends Controller {
  defaultItemsPerPage = 10;

  baseRecipientPaymentList = async ({
    req,
    totalCount,
    list,
    timeFilterType,
  }) => {
    const timeInfos = await this.getListTimeAutoOption(req, timeFilterType);

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      totalCount(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  baseAllRecipientPaymentList = async (
    req,
    userId = null,
    timeFilterType = STATIC.TIME_FILTER_TYPES.DURATION
  ) => {
    const totalCount = async (filter, timeInfos) =>
      this.recipientPaymentModel.totalCount(filter, timeInfos, {
        userId,
        receivedType: req.body.type,
        status: req.body.status,
      });

    const list = (options) => {
      options["userId"] = userId;
      options["receivedType"] = req.body.type;
      options["status"] = req.body.status;

      return this.recipientPaymentModel.list(options);
    };

    return await this.baseRecipientPaymentList({
      req,
      totalCount,
      list,
      timeFilterType,
    });
  };

  userList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const result = await this.baseAllRecipientPaymentList(
        req,
        userId,
        STATIC.TIME_FILTER_TYPES.DURATION
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAllRecipientPaymentList(
        req,
        null,
        STATIC.TIME_FILTER_TYPES.TYPE
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  markAsCompletedRefund = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      await this.recipientPaymentModel.complete(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = RecipientPaymentController;
