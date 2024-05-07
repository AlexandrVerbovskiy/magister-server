const STATIC = require("../static");
const {
  createPaypalOrder,

} = require("../utils");

const Controller = require("./Controller");

class SenderPaymentController extends Controller {
  constructor() {
    super();
  }

  paypalCreateOrder = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { amount, orderId } = req.body;

      const order = await this.orderModel.getById(orderId);

      if (order.status !== STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Unable to perform an operation for the current order status"
        );
      }

      const result = await createPaypalOrder(
        amount,
        orderId,
        order.listingName
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseSenderPaymentList = async (req, userId = null) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.senderPaymentModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"],
          userId
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    options["userId"] = userId;

    const requests = await this.senderPaymentModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  userList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const result = await this.baseSenderPaymentList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseSenderPaymentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = new SenderPaymentController();
