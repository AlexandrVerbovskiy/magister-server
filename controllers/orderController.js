const STATIC = require("../static");
const {
  generateDatesBetween,
  generateRandomString,
  getPaypalOrderInfo,
  capturePaypalOrder,
  sendMoneyToPaypalByPaypalID,
  getDaysDifference,
  tenantPaymentCalculate,
} = require("../utils");
const Controller = require("./Controller");
const qrcode = require("qrcode");

class OrderController extends Controller {
  constructor() {
    super();
  }

  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;

      const order = await this.orderModel.getFullById(id);

      if (!order || (userId != order.tenantId && userId != order.ownerId)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { pricePerDay, startDate, endDate, listingId } = req.body;
      const tenantId = req.userData.userId;

      const tenantFee =
        await this.systemOptionModel.getTenantBaseCommissionPercent();
      const ownerFee =
        await this.systemOptionModel.getOwnerBaseCommissionPercent();

      const blockedDates = await this.orderModel.getBlockedListingDatesForUser(
        listingId,
        tenantId
      );

      const selectedDates = generateDatesBetween(startDate, endDate);

      const hasBlockedDate = selectedDates.find((selectedDate) =>
        blockedDates.includes(selectedDate)
      );

      if (hasBlockedDate) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "The selected date is not available for booking"
        );
      }

      const createdOrderId = await this.orderModel.create({
        pricePerDay,
        startDate,
        endDate,
        listingId,
        tenantId,
        ownerFee: ownerFee,
        tenantFee: tenantFee,
      });

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        {
          id: createdOrderId,
        }
      );
    });

  baseRequestsList = async (req, totalCountCall, listCall) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    const type = req.body.type == "owner" ? "owner" : "tenant";

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        totalCountCall(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    const requests = await listCall(options);

    const requestsWithImages = await this.listingModel.listingsBindImages(
      requests,
      "listingId"
    );

    return {
      items: requestsWithImages,
      options: { ...options, type },
      countItems,
    };
  };

  baseTenantBookingList = async (req) => {
    const tenantId = req.userData.userId;

    const totalCountCall = (filter, serverFromTime, serverToTime) =>
      this.orderModel.tenantBookingsTotalCount(
        filter,
        serverFromTime,
        serverToTime,
        tenantId
      );

    const listCall = (options) => {
      options["tenantId"] = tenantId;
      return this.orderModel.tenantBookingsList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  baseListingOwnerBookingList = async (req) => {
    const ownerId = req.userData.userId;

    const totalCountCall = (filter, serverFromTime, serverToTime) =>
      this.orderModel.ownerBookingsTotalCount(
        filter,
        serverFromTime,
        serverToTime,
        ownerId
      );

    const listCall = (options) => {
      options["ownerId"] = ownerId;
      return this.orderModel.ownerBookingsList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  bookingList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const isForTenant = req.body.type !== "owner";

      const request = isForTenant
        ? this.baseTenantBookingList
        : this.baseListingOwnerBookingList;

      const result = await request(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseAdminBookingList = async (req) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.orderModel.allBookingsTotalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    const orders = await this.orderModel.allBookingsList(options);

    return {
      items: orders,
      options,
      countItems,
    };
  };

  adminBookingList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAdminBookingList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseTenantOrderList = async (req) => {
    const tenantId = req.userData.userId;

    const totalCountCall = (filter, serverFromTime, serverToTime) =>
      this.orderModel.tenantOrdersTotalCount(
        filter,
        serverFromTime,
        serverToTime,
        tenantId
      );

    const listCall = (options) => {
      options["tenantId"] = tenantId;
      return this.orderModel.tenantOrdersList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  baseListingOwnerOrderList = async (req) => {
    const ownerId = req.userData.userId;

    const totalCountCall = (filter, serverFromTime, serverToTime) =>
      this.orderModel.ownerOrdersTotalCount(
        filter,
        serverFromTime,
        serverToTime,
        ownerId
      );

    const listCall = (options) => {
      options["ownerId"] = ownerId;
      return this.orderModel.ownerOrderList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  orderList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const isForTenant = req.body.type !== "owner";

      const request = isForTenant
        ? this.baseTenantOrderList
        : this.baseListingOwnerOrderList;

      const result = await request(req);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseAdminOrderList = async (req) => {
    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.NULL,
    });

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.orderModel.allOrderList(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    const orders = await this.orderModel.allOrderList(options);

    return {
      items: orders,
      options,
      countItems,
    };
  };

  adminOrderList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAdminBookingList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  allList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const totalCountCall = (filter, serverFromTime, serverToTime) =>
        this.orderModel.fullTotalCount(filter, serverFromTime, serverToTime);

      const listCall = (options) => {
        return this.orderModel.fullList(filter, serverFromTime, serverToTime);
      };

      const result = await this.baseRequestsList(req, totalCountCall, listCall);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  acceptBooking = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const userId = req.userData.userId;

      const order = await this.orderModel.getById(id);

      if (!order) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (order.tenantId != userId && order.ownerId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (
        (order.status != STATIC.ORDER_STATUSES.PENDING_OWNER &&
          order.status != STATIC.ORDER_STATUSES.PENDING_TENANT) ||
        order.cancelStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastUpdateRequestInfo =
        await this.orderUpdateRequestModel.getFullForLastActive(id);

      if (
        (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT &&
          order.tenantId != userId) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
          order.ownerId != userId)
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (lastUpdateRequestInfo) {
        await this.orderModel.acceptUpdateRequest(id, {
          newStartDate: lastUpdateRequestInfo.newStartDate,
          newEndDate: lastUpdateRequestInfo.newEndDate,
          newPricePerDay: lastUpdateRequestInfo.newPricePerDay,
          prevPricePerDay: order.offerPricePerDay,
          prevStartDate: order.offerStartDate,
          prevEndDate: order.offerEndDate,
        });
        await this.orderUpdateRequestModel.closeLast(id);
      } else {
        await this.orderModel.acceptOrder(id);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  rejectBooking = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const userId = req.userData.userId;

      const order = await this.orderModel.getById(id);

      if (!order) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (order.tenantId != userId && order.ownerId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (
        (order.status !== STATIC.ORDER_STATUSES.PENDING_OWNER &&
          order.status !== STATIC.ORDER_STATUSES.PENDING_TENANT &&
          order.status !== STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) ||
        order.cancelStatus
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Unable to perform an operation for the current order status"
        );
      }

      const lastUpdateRequestInfo =
        await this.orderUpdateRequestModel.getFullForLastActive(id);

      if (
        (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT &&
          order.tenantId != userId) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
          order.ownerId != userId)
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      let newData = {};

      if (lastUpdateRequestInfo) {
        newData = {
          newStartDate: lastUpdateRequestInfo.newStartDate,
          newEndDate: lastUpdateRequestInfo.newEndDate,
          newPricePerDay: lastUpdateRequestInfo.newPricePerDay,
          prevPricePerDay: order.offerPricePerDay,
          prevStartDate: order.offerStartDate,
          prevEndDate: order.offerEndDate,
        };
      }

      if (order.tenantId == userId) {
        await this.orderModel.successCanceled(id, newData);
      } else {
        await this.orderModel.rejectOrder(id, newData);
      }

      await this.orderUpdateRequestModel.closeLast(id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      await this.orderModel.delete(id);
      this.saveUserAction(req, `Removed order with id '${id}'`);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
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
          STATIC.ORDER_TENANT_GOT_ITEM_APPROVE_URL +
          "/" +
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

  approveClientGotListing = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token } = req.body;
      const { userId } = req.userData;

      const orderInfo = await this.orderModel.getFullByTenantListingToken(
        token
      );

      if (
        orderInfo.status !== STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT ||
        orderInfo.cancelStatus
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Unable to perform an operation for the current order status"
        );
      }

      if (!orderInfo || orderInfo.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const ownerToken = generateRandomString();
      const generatedImage = await qrcode.toDataURL(
        process.env.CLIENT_URL +
          STATIC.ORDER_OWNER_GOT_ITEM_APPROVE_URL +
          "/" +
          ownerToken
      );

      await this.orderModel.orderTenantGotListing(orderInfo.id, {
        token: ownerToken,
        qrCode: generatedImage,
      });

      await this.recipientPaymentModel.paymentPlanGeneration({
        startDate: orderInfo.offerStartDate,
        endDate: orderInfo.offerEndDate,
        pricePerDay: orderInfo.offerPricePerDay,
        userId: orderInfo.ownerId,
        orderId: orderInfo.id,
        paypalId: "123",
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        qrCode: generatedImage,
      });
    });

  baseCancelOrder = async ({
    req,
    res,
    userId,
    userType,
    cancelFunc,
    availableStatusesToCancel = [],
  }) => {
    const { id } = req.body;

    const orderInfo = await this.orderModel.getFullById(id);

    if (!orderInfo) {
      return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
    }

    const isOwner = userType === "owner";
    const isTenant = userType === "tenant";

    const isCancelByTenant = isTenant && orderInfo.tenantId === userId;
    const isCancelByOwner = isOwner && orderInfo.ownerId === userId;

    if (!isCancelByTenant && !isCancelByOwner) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    if (orderInfo.cancelStatus != null) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "You cannot cancel an order if it has already been canceled or is in the process of being canceled"
      );
    }

    if (!availableStatusesToCancel.includes(orderInfo.status)) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "You cannot cancel an order with its current status"
      );
    }

    const funcResult = await cancelFunc(id, orderInfo);
    return funcResult ?? this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  acceptCancelOrder = async (req, res, userId, userType) => {
    const { id } = req.body;

    const orderInfo = await this.orderModel.getFullById(id);

    if (!orderInfo) {
      return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
    }

    if (
      userType === "tenant" &&
      orderInfo.cancelStatus !=
        STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
    ) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "You cannot cancel an order if it has already been canceled or is in the process of being canceled"
      );
    }

    const isOwner = userType === "owner";
    const isTenant = userType === "tenant";

    const isAcceptCancelByTenant = isTenant && orderInfo.tenantId === userId;
    const isAcceptCancelByOwner = isOwner && orderInfo.ownerId === userId;

    if (!isAcceptCancelByTenant && !isAcceptCancelByOwner) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const tenantInfo = await this.userModel.getById(orderInfo.tenantId);

    await sendMoneyToPaypalByPaypalID(
      tenantInfo.paypalId,
      tenantPaymentCalculate(
        orderInfo.offerStartDate,
        orderInfo.offerEndDate,
        orderInfo.tenantFee,
        orderInfo.offerPricePerDay
      )
    );

    const unfinishedPAymentsSum =
      await this.recipientPaymentModel.markRentalAsCancelledByOrderId(id);

    if (unfinishedPAymentsSum > 0) {
      await this.recipientPaymentModel.createRefundPayment({
        money: unfinishedPAymentsSum,
        userId: orderInfo.tenantId,
        orderId: id,
        paypalId: tenantInfo.paypalId,
      });
    }

    await this.orderModel.successCanceled(id);

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  cancelByTenant = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      return this.baseCancelOrder({
        req,
        res,
        userId,
        userType: "tenant",
        availableStatusesToCancel: [
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        ],
        cancelFunc: this.orderModel.startCancelByTenant,
      });
    });

  cancelByOwner = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      return this.baseCancelOrder({
        req,
        res,
        userId,
        userType: "owner",
        availableStatusesToCancel: [
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        ],
        cancelFunc: this.orderModel.startCancelByOwner,
      });
    });

  acceptCancelByTenant = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      return this.acceptCancelOrder(req, res, userId, "tenant");
    });

  acceptCancelByOwner = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      return this.acceptCancelOrder(req, res, userId, "owner");
    });

  fullCancelPayed = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const { id } = req.body;

      const orderInfo = await this.orderModel.getById(id);

      if (!orderInfo) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const {
        tenantId,
        status,
        cancelStatus,
        offerStartDate,
        offerEndDate,
        tenantFee,
        offerPricePerDay,
      } = orderInfo;

      if (tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (cancelStatus != null) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot cancel an order if it has already been canceled or is in the process of being canceled"
        );
      }

      if (status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot cancel an order with the current order status"
        );
      }

      const canFastCancelPayed =
        this.orderModel.canFastCancelPayedOrder(orderInfo);

      if (!canFastCancelPayed) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You can no longer cancel the reservation because the available time has passed"
        );
      }

      const userInfo = await this.userModel.getById(userId);

      if (!userInfo.paypalId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.UNPREDICTABLE,
          "You cannot get a refund until you have a PayPal ID in your profile"
        );
      }

      const factTotalPrice = tenantPaymentCalculate(
        offerStartDate,
        offerEndDate,
        tenantFee,
        offerPricePerDay
      );

      await sendMoneyToPaypalByPaypalID(userInfo.paypalId);

      await this.orderModel.successCanceled(id);

      await this.recipientPaymentModel.createRefundPayment({
        money: factTotalPrice,
        userId: userId,
        orderId: id,
        paypalId: userInfo.paypalId,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  fullCancel = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      return this.baseCancelOrder({
        req,
        res,
        userId,
        userType: "tenant",
        availableStatusesToCancel: [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
        ],
        cancelFunc: this.orderModel.successCanceled,
      });
    });

  finishedByOwner = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      const { token } = req.body;

      const orderInfo = await this.orderModel.getFullByOwnerListingToken(token);

      if (!orderInfo || orderInfo.ownerId !== userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (orderInfo.cancelStatus != null) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot finished an order if it has already been canceled or is in the process of being canceled"
        );
      }

      if (orderInfo.status !== STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot finished an order with its current status"
        );
      }

      await this.orderModel.orderFinished(token);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = new OrderController();
