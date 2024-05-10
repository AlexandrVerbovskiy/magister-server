const STATIC = require("../static");
const {
  createPaypalOrder,
  getDaysDifference,
  timeConverter,
  shortTimeConverter,
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

  generateInvoicePdf = async (req, res) => {
    const { id } = req.params;
    const userId = req.userData.userId;
    const payment = await this.senderPaymentModel.getFullById(id);

    if (!payment || payment.payerId != userId) {
      return res.send(404);
    }

    const offerStartDate = payment.orderOfferStartDate;
    const offerEndDate = payment.orderOfferEndDate;

    const offerSubTotalPrice =
      payment.orderFactTotalPrice *
      getDaysDifference(offerStartDate, offerEndDate);

    const durationString =
      offerStartDate == offerEndDate
        ? shortTimeConverter(offerStartDate)
        : `${shortTimeConverter(offerStartDate)} - ${shortTimeConverter(
            offerEndDate
          )}`;

    const params = {
      billTo: payment.listingAddress ?? payment.listingCity,
      shipTo: payment.listingAddress ?? payment.listingCity,
      invoiceId: payment.id,
      invoiceDate: shortTimeConverter(payment.createdAt),
      purchaseOrder: payment.orderId,
      dueDate: shortTimeConverter(payment.createdAt),
      offer: {
        factTotalPrice: payment.orderFactTotalPrice.toFixed(2),
        fee: payment.orderFee,
        listingName: payment.listingName,
        pricePerDay: payment.orderOfferPricePerDay.toFixed(2),
        subTotalPrice: offerSubTotalPrice.toFixed(2),
        factTotalFee: ((offerSubTotalPrice * payment.orderFee) / 100).toFixed(
          2
        ),
        durationString,
      },
    };

    const buffer = await this.generatePdf("/pdfs/invoice", params);
    res.contentType("application/pdf");
    res.send(buffer);
  };
}

module.exports = new SenderPaymentController();
