const STATIC = require("../static");
const {
  createPaypalOrder,
  getDaysDifference,
  shortTimeConverter,
  tenantPaymentCalculate,
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

  baseSenderPaymentList = async ({ req, totalCount, list }) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

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

  baseAllSenderPaymentList = async (req, userId = null) => {
    const totalCount = (filter, timeInfos) =>
      this.senderPaymentModel.totalCount(filter, timeInfos, userId);

    const list = (options) => {
      options["userId"] = userId;
      return this.senderPaymentModel.list(options);
    };

    return await this.baseSenderPaymentList({ req, totalCount, list });
  };

  waitingAdminApprovalSenderPaymentList = async (req) => {
    const totalCount = (filter, timeInfos) =>
      this.senderPaymentModel.waitingAdminApprovalTransactionTotalCount(
        filter,
        timeInfos
      );

    const list = (options) =>
      this.senderPaymentModel.waitingAdminApprovalTransactionList(options);

    return await this.baseSenderPaymentList({ req, totalCount, list });
  };

  userList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const result = await this.baseAllSenderPaymentList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAllSenderPaymentList(req);
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
        payed: payment.adminApproved
          ? offerTotalPrice.toFixed(2)
          : (0).toFixed(2),
      };

      const buffer = await this.generatePdf("/pdfs/invoice", params);
      res.contentType("application/pdf");
      res.send(buffer);
    });

  updateCreditCardTransactionProof = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { orderId } = req.body;

      const order = await this.orderModel.getById(orderId);

      if (order.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const proofUrl = this.moveUploadsFileToFolder(req.file, "paymentProofs");

      await this.searchedWordModel.updateCreditCardTransactionProof(
        orderId,
        proofUrl
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        proofUrl,
      });
    });

  approveTransaction = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId } = req.body;
      await this.senderPaymentModel.approveTransaction(orderId);

      const { token: ownerToken, image: generatedImage } =
        this.generateQrCodeInfo(STATIC.ORDER_TENANT_GOT_ITEM_APPROVE_URL);

      await this.orderModel.orderTenantPayed(orderId, {
        token: ownerToken,
        qrCode: generatedImage,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  rejectTransaction = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, description } = req.body;
      await this.senderPaymentModel.rejectTransaction(orderId, description);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = new SenderPaymentController();
