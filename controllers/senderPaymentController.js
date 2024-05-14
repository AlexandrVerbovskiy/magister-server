const STATIC = require("../static");
const {
  createPaypalOrder,
  getDaysDifference,
  timeConverter,
  shortTimeConverter,
  tenantPaymentCalculate,
} = require("../utils");
const fs = require("fs");
const path = require("path");

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

  generateInvoicePdf = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const payment = await this.senderPaymentModel.getFullById(id);

      if (!payment || payment.payerId != userId) {
        return res.send(404);
      }

      const offerStartDate = payment.orderOfferStartDate;
      const offerEndDate = payment.orderOfferEndDate;
      const offerPricePerDay = payment.orderOfferPricePerDay;

      const offerTotalPrice = tenantPaymentCalculate(
        offerStartDate,
        offerEndDate,
        payment.tenantFee,
        offerPricePerDay
      );

      const offerSubTotalPrice =
        getDaysDifference(offerStartDate, offerEndDate) * offerPricePerDay;

      const factTotalFee = (offerSubTotalPrice * payment.tenantFee) / 100;

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
          factTotalPrice: offerTotalPrice.toFixed(2),
          fee: payment.tenantFee,
          listingName: payment.listingName,
          pricePerDay: offerPricePerDay.toFixed(2),
          subTotalPrice: offerSubTotalPrice.toFixed(2),
          factTotalFee: factTotalFee.toFixed(2),
          durationString,
        },
      };

      const destinationDir = path.join(
        STATIC.MAIN_DIRECTORY,
        "public/invoices"
      );
      const filename = destinationDir + `/inv-${payment.id}.pdf`;

      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      if (!fs.existsSync(filename)) {
        const buffer = await this.generatePdf("/pdfs/invoice", params);
        fs.writeFileSync(filename, buffer);
      }

      res.download(filename);
    });
}

module.exports = new SenderPaymentController();
