const STATIC = require("../static");
const {
  createPaypalOrder,
  refundPaypalOrderCapture,
  getPaypalOrderInfo,
  capturePaypalOrder,
  generateRandomString,
} = require("../utils");
const qrcode = require("qrcode");

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

  paypalOrderPayed = async (req, res) =>
    this.baseWrapper(res, res, async () => {
      const { userId } = req.userData;
      const { orderId: paypalOrderId } = req.body;

      await capturePaypalOrder(paypalOrderId);

      const paypalOrderInfo = await getPaypalOrderInfo(paypalOrderId);

      const paypalSenderId = paypalOrderInfo.payment_source.paypal?.account_id;
      const orderId = paypalOrderInfo.purchase_units[0].items[0].sku;
      const paypalCaptureId =
        paypalOrderInfo.purchase_units[0].payments.captures[0].id;

      const amount = paypalOrderInfo.purchase_units[0].amount.value;

      const token = generateRandomString();
      const generatedImage = await qrcode.toDataURL(
        process.env.CLIENT_URL +
          "/dashboard/orders/approve-tenant-listing/" +
          token
      );

      await this.orderModel.orderTenantPayed(orderId, {
        token,
        qrCode: generatedImage,
      });

      await this.senderPaymentModel.create({
        money: amount,
        userId: userId,
        orderId: orderId,
        paypalSenderId: paypalSenderId,
        paypalOrderId: paypalOrderId,
        paypalCaptureId: paypalCaptureId,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
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
