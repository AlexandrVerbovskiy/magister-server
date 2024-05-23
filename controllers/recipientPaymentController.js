const STATIC = require("../static");
const {
  sendMoneyToPaypalByPaypalID,
  tenantPaymentCalculate,
} = require("../utils");
const Controller = require("./Controller");

class RecipientPaymentController extends Controller {
  constructor() {
    super();
  }

  defaultItemsPerPage = 10;

  baseRecipientPaymentList = async (req, userId = null) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
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

  baseWaitingRefundsList = async (req) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.recipientPaymentModel.totalCountWaitingRefunds(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await this.recipientPaymentModel.listWaitingRefunds(
      options
    );

    return {
      items: requests,
      options,
      countItems,
    };
  };

  waitingRefundsList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseWaitingRefundsList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  markAsCompletedRefund = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      await this.recipientPaymentModel.complete(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  markAsFailedRefund = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, description } = req.body;
      await this.recipientPaymentModel.reject(id, description);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  markFailedRecipientDone = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, paymentNumber } = req.body;
      await this.recipientPaymentModel.markFailedAsDone(id, paymentNumber);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  updateFailed = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, type, paypalId = null, cardNumber = null } = req.body;
      const { userId } = req.userData;
      const data = {};

      const recipient = await this.recipientPaymentModel.getById(id);

      if (userId != recipient.recipientId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (type == "card") {
        data["cardNumber"] = cardNumber;
        await this.recipientPaymentModel.updateRefundPayment({
          id,
          type: "card",
          data,
          status: STATIC.RECIPIENT_STATUSES.WAITING,
        });
      }

      if (type == "paypal") {
        data["paypalId"] = paypalId;

        try {
          const factTotalPrice = tenantPaymentCalculate(
            recipient.offerStartDate,
            recipient.offerEndDate,
            recipient.tenantFee,
            recipient.offerPricePerDay
          );

          const tenantCancelFeePercent =
            await this.systemOptionModel.getTenantCancelCommissionPercent();

          const factTotalPriceWithoutCommission =
            (factTotalPrice * (100 - tenantCancelFeePercent)) / 100;

          await sendMoneyToPaypalByPaypalID(
            paypalId,
            factTotalPriceWithoutCommission
          );

          await this.recipientPaymentModel.updateRefundPayment({
            id,
            type: "paypal",
            data,
            status: STATIC.RECIPIENT_STATUSES.COMPLETED,
          });
        } catch (e) {
          console.log("test: ", e.message);
          await this.recipientPaymentModel.updateRefundPayment({
            id,
            type: "paypal",
            data,
            status: STATIC.RECIPIENT_STATUSES.FAILED,
            failedDescription: e.message,
          });
        }
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = new RecipientPaymentController();
