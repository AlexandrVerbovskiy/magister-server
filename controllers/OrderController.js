const { predictTempOrderDispute } = require("../services/forestServerRequests");
const STATIC = require("../static");
const {
  getPaypalOrderInfo,
  capturePaypalOrder,
  invoicePdfGeneration,
  getPriceByDays,
  renterPaysCalculate,
} = require("../utils");
const Controller = require("./Controller");
const fs = require("fs");

class OrderController extends Controller {
  sendMessageForNewOrder = async ({ message, senderId, opponentId = null }) => {
    if (!opponentId) {
      opponentId = senderId;
    }

    const chatId = message.chatId;
    const sender = await this.userModel.getById(senderId);

    await this.sendSocketMessageToUserOpponent(
      chatId,
      senderId,
      "get-message",
      {
        message,
        opponent: sender,
      }
    );
  };

  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;

      const order = await this.orderModel.getFullById(id);

      if (!order || (userId != order.renterId && userId != order.ownerId)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (order.status === STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT) {
        order["payedInfo"] = await this.senderPaymentModel.getInfoByOrderId(
          order.id
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  baseCreate = async ({
    finishDate,
    startDate,
    price,
    listingId,
    renterId,
  }) => {
    const listing = await this.listingModel.getLightById(listingId);

    if (!listing) {
      return { error: "Listing not found", orderId: null };
    }

    if (!listing.approved || !listing.active || listing.ownerId == renterId) {
      return { error: "Access denied", orderId: null };
    }

    const renterFee =
      await this.systemOptionModel.getRenterBaseCommissionPercent();

    const ownerFee =
      await this.systemOptionModel.getOwnerBaseCommissionPercent();

    const orderId = await this.orderModel.create({
      price,
      finishDate,
      startDate,
      listingId,
      renterId,
      ownerFee: ownerFee,
      renterFee: renterFee,
    });

    return {
      error: null,
      orderId,
      finishDate,
      startDate,
      price,
    };
  };

  baseCreateWithMessageSend = async (req, needReturnMessage = false) => {
    const { finishDate, startDate, price, listingId, message } = req.body;
    const renterId = req.userData.userId;

    const result = await this.baseCreate({
      finishDate,
      startDate,
      price,
      listingId,
      renterId,
    });

    if (result.error) {
      return {
        error: true,
        baseInfo: STATIC.ERRORS.BAD_REQUEST,
        message: result.error,
      };
    }

    const createdOrderId = result.orderId;

    const listing = await this.listingModel.getFullById(listingId);

    if (!listing) {
      return {
        error: true,
        baseInfo: STATIC.ERRORS.NOT_FOUND,
        message: "Listing not found",
      };
    }

    this.sendBookingApprovalRequestMail(listing.userEmail);

    const firstImage = listing.listingImages[0];
    const ownerId = listing.ownerId;

    const createdMessage = await this.chatModel.createForOrder({
      ownerId,
      renterId,
      orderInfo: {
        orderId: createdOrderId,
        listingName: listing.name,
        offerPrice: result.price,
        offerFinishDate: result.finishDate,
        offerStartDate: result.startDate,
        listingPhotoPath: firstImage?.link,
        listingPhotoType: firstImage?.type,
        description: message,
      },
    });

    await this.sendMessageForNewOrder({
      message: createdMessage,
      senderId: renterId,
    });

    const returningResult = {
      error: false,
      baseInfo: STATIC.SUCCESS.OK,
      message: "Created successfully",
      data: {
        id: createdOrderId,
      },
    };

    if (needReturnMessage) {
      const senderOpponent = await this.userModel.getById(ownerId);
      returningResult.data.chatMessage = createdMessage;
      returningResult.data.opponent = senderOpponent;
    }

    return returningResult;
  };

  getNewPrediction = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { finishDate, startDate, price, listingId } = req.body;
      const renterId = req.userData.userId;

      const listing = await this.listingModel.getLightById(listingId);

      if (!listing) {
        return { error: "Listing not found", orderId: null };
      }

      if (!listing.approved || !listing.active || listing.ownerId == renterId) {
        return { error: "Access denied", orderId: null };
      }

      const renterFee =
        await this.systemOptionModel.getRenterBaseCommissionPercent();

      const ownerFee =
        await this.systemOptionModel.getOwnerBaseCommissionPercent();

      let tempOrderId = await this.orderModel.checkTempExist(
        listingId,
        renterId
      );

      if (tempOrderId) {
        await this.orderModel.updateTemp({
          tempOrderId,
          price,
          finishDate,
          startDate,
          ownerFee: ownerFee,
          renterFee: renterFee,
        });
      } else {
        tempOrderId = await this.orderModel.createTemp({
          price,
          finishDate,
          startDate,
          listingId,
          renterId,
          ownerFee: ownerFee,
          renterFee: renterFee,
        });
      }

      const result = await predictTempOrderDispute(tempOrderId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseCreateWithMessageSend(req);

      if (result.error) {
        return this.sendErrorResponse(res, result.baseInfo, result.message);
      } else {
        return this.sendSuccessResponse(
          res,
          result.baseInfo,
          result.message,
          result.data
        );
      }
    });

  baseRequestsList = async (req, totalCountCall, listCall) => {
    const type = req.body.type == "owner" ? "owner" : "renter";
    const userId = req.userData.userId;

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      totalCountCall(filter)
    );

    const requests = await listCall(options);

    const requestsWithImages = await this.listingModel.listingsBindImages(
      requests,
      "listingId"
    );

    const orderIds = requestsWithImages.map((request) => request.id);

    const paymentInfos =
      await this.senderPaymentModel.getInfoAboutOrdersPayments(orderIds);

    requestsWithImages.forEach(
      (request, index) =>
        (requestsWithImages[index]["paymentInfo"] = paymentInfos[request.id])
    );

    requestsWithImages.forEach((request, index) => {
      requestsWithImages[index]["canFastCancelPayed"] =
        this.orderModel.canFastCancelPayedOrder(request);

      requestsWithImages[index]["canFinalization"] =
        this.orderModel.canFinalizationOrder(request);
    });

    let requestsWithRatingImages = await this.bindOrderRating(
      requestsWithImages
    );

    requestsWithRatingImages =
      await this.listingModel.bindRenterListCountListings(
        requestsWithRatingImages,
        "renterId"
      );

    requestsWithRatingImages =
      await this.listingModel.bindOwnerListCountListings(
        requestsWithRatingImages,
        "renterId"
      );

    return {
      items: requestsWithRatingImages,
      options: { ...options, type },
      countItems,
    };
  };

  baseAdminOptionsAdd = async (orders) => {
    const listingIds = orders.map((order) => order.listingId);
    const listingCounts = await this.listingModel.timeRentedByIds(listingIds);

    orders.forEach((order, index) => {
      orders[index]["listingRentalCount"] = listingCounts[order.listingId];
    });

    return orders;
  };

  bindOrderRating = async (orders) => {
    orders = await this.renterCommentModel.bindAverageForKeyEntities(
      orders,
      "renterId",
      {
        commentCountName: "renterCommentCount",
        averageRatingName: "renterAverageRating",
      }
    );

    orders = await this.ownerCommentModel.bindAverageForKeyEntities(
      orders,
      "ownerId",
      {
        commentCountName: "ownerCommentCount",
        averageRatingName: "ownerAverageRating",
      }
    );

    return orders;
  };

  baseRenterOrderList = async (req) => {
    const renterId = req.userData.userId;

    const totalCountCall = (filter) =>
      this.orderModel.renterOrdersTotalCount(filter, renterId);

    const listCall = (options) => {
      options["renterId"] = renterId;
      return this.orderModel.renterOrdersList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  baseListingOwnerOrderList = async (req) => {
    const ownerId = req.userData.userId;

    const totalCountCall = (filter) =>
      this.orderModel.ownerOrdersTotalCount(filter, ownerId);

    const listCall = (options) => {
      options["ownerId"] = ownerId;
      return this.orderModel.ownerOrderList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  baseOrderList = async (req) => {
    const isForRenter = req.body.type !== "owner";

    const request = isForRenter
      ? this.baseRenterOrderList
      : this.baseListingOwnerOrderList;

    return await request(req);
  };

  orderList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseOrderList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  baseAdminOrderList = async (req) => {
    const timeInfos = await this.listTimeNameOption(req);
    const type = req.body.type ?? "all";
    const filter = req.body.filter ?? "";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.orderModel.allOrdersTotalCount(filter, type, timeInfos)
    );

    options["type"] = type;

    options = this.addTimeInfoToOptions(options, timeInfos);

    const statusCount = await this.orderModel.getOrderStatusesCount({
      filter,
      timeInfos,
    });

    let orders = await this.orderModel.allOrderList(options);

    orders = await this.baseAdminOptionsAdd(orders);

    orders = await this.bindOrderRating(orders);

    return {
      items: orders,
      options,
      countItems,
      statusCount,
    };
  };

  adminOrderList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseAdminOrderList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  acceptBooking = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const userId = req.userData.userId;

      const order = await this.orderModel.getFullById(id);

      if (!order) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (
        !(
          (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
            order.ownerId == userId) ||
          (order.status == STATIC.ORDER_STATUSES.PENDING_RENTER &&
            order.renterId == userId)
        )
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (order.cancelStatus || order.disputeStatus) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastUpdateRequestInfo =
        await this.orderUpdateRequestModel.getFullForLastActive(id);

      const orderPart = {};

      if (lastUpdateRequestInfo) {
        orderPart["finishDate"] = lastUpdateRequestInfo.newFinishDate;
        orderPart["startDate"] = lastUpdateRequestInfo.newStartDate;
        orderPart["price"] = lastUpdateRequestInfo.newPrice;
        orderPart["prevFinishDate"] = order.offerFinishDate;
        orderPart["prevStartDate"] = order.offerStartDate;
        orderPart["prevPrice"] = order.offerPrice;

        await this.orderModel.acceptUpdateRequest(id, orderPart);
        await this.orderUpdateRequestModel.closeLast(id);
      } else {
        await this.orderModel.acceptOrder(id);
      }

      const newStatus = STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT;

      let chatId = order.chatId;
      let createMessageFunc = this.chatMessageModel.createAcceptedOrderMessage;
      let messageData = {};

      orderPart["id"] = order.id;
      orderPart["status"] = newStatus;

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId: userId,
        createMessageFunc,
        orderPart,
      });

      this.sendAssetPickupMail(order.renterEmail, order.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        ...orderPart,
      });
    });

  baseRejectBooking = async (req) => {
    const { id } = req.body;
    const userId = req.userData.userId;

    const order = await this.orderModel.getFullWithPaymentById(id);

    if (!order) {
      return {
        error: {
          status: STATIC.ERRORS.NOT_FOUND,
        },
      };
    }

    if (
      !(
        !order.paymentInfo?.waitingApproved &&
        [
          STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
          STATIC.ORDER_STATUSES.PENDING_RENTER,
          STATIC.ORDER_STATUSES.PENDING_OWNER,
        ].includes(order.status)
      )
    ) {
      return {
        error: {
          status: STATIC.ERRORS.FORBIDDEN,
        },
      };
    }

    if (order.cancelStatus || order.disputeStatus) {
      return {
        error: {
          status: STATIC.ERRORS.FORBIDDEN,
        },
      };
    }

    const lastUpdateRequestInfo =
      await this.orderUpdateRequestModel.getFullForLastActive(id);

    const orderPart = {};

    if (lastUpdateRequestInfo) {
      orderPart["finishDate"] = lastUpdateRequestInfo.newFinishDate;
      orderPart["startDate"] = lastUpdateRequestInfo.newStartDate;
      orderPart["price"] = lastUpdateRequestInfo.newPrice;
      orderPart["prevFinishDate"] = order.offerFinishDate;
      orderPart["prevStartDate"] = order.offerStartDate;
      orderPart["prevPrice"] = order.offerPrice;
    }

    let newStatus = null;
    let newCancelStatus = null;

    if (order.renterId == userId) {
      await this.orderModel.successCancelled(id, orderPart);
      newStatus = STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
    } else {
      await this.orderModel.rejectOrder(id, orderPart);
      newCancelStatus = STATIC.ORDER_STATUSES.REJECTED;
      newStatus = order.status;
    }

    await this.orderUpdateRequestModel.closeLast(id);

    let chatId = order.chatId;
    let createMessageFunc = this.chatMessageModel.createRejectedOrderMessage;
    let messageData = {};

    orderPart["id"] = order.id;
    orderPart["status"] = newStatus;
    orderPart["cancelStatus"] = newCancelStatus;

    const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
      chatId,
      messageData,
      senderId: userId,
      createMessageFunc,
      orderPart,
    });

    this.sendBookingCancellationOwnerMail(order.renterEmail, order.id);

    return {
      chatMessage,
      ...orderPart,
    };
  };

  rejectBooking = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseRejectBooking(req);

      if (result.error) {
        return this.sendErrorResponse(
          res,
          result.error.status,
          result.error.message ?? null
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
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

      const payment = await this.senderPaymentModel.getPaymentInfoByPaypal(
        paypalOrderId
      );

      if (!payment) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Payment info not found"
        );
      }

      await capturePaypalOrder(paypalOrderId);

      const paypalOrderInfo = await getPaypalOrderInfo(paypalOrderId);

      const payerCardLastDigits =
        paypalOrderInfo.payment_source?.card?.last_digits;
      const payerCardLastBrand = paypalOrderInfo.payment_source?.card?.brand;

      const paypalSenderId = paypalOrderInfo.payment_source.paypal?.account_id;
      const orderId = payment.orderId;

      if (
        payment.renterId != userId ||
        payment.disputeStatus ||
        payment.orderStatus !== STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const paypalCaptureId =
        paypalOrderInfo.purchase_units[0].payments.captures[0].id;

      const newStatus = await this.orderModel.orderRenterPayed(orderId);

      await this.senderPaymentModel.updateByPaypal({
        orderId: orderId,
        paypalSenderId: paypalSenderId,
        paypalOrderId: paypalOrderId,
        paypalCaptureId: paypalCaptureId,
        payerCardLastDigits,
        payerCardLastBrand,
      });

      let chatId = payment.chatId;
      let createMessageFunc =
        this.chatMessageModel.createOwnerPayedOrderMessage;
      let messageData = {};
      let orderPart = {
        id: orderId,
        status: newStatus,
      };

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId: userId,
        createMessageFunc,
        orderPart,
      });

      this.sendPaymentNotificationMail(payment.ownerEmail, payment.orderId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        ...orderPart,
      });
    });

  unpaidTransactionByBankTransfer = async (req, res) => {
    const { userId } = req.userData;
    const { orderId } = req.body;

    const order = await this.orderModel.getFullWithPaymentById(orderId);

    if (!order) {
      return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
    }

    if (order.ownerId != userId) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    if (
      order.cancelStatus ||
      order.disputeStatus ||
      order.status !== STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT ||
      (order.payedId && order.payedType == STATIC.PAYMENT_TYPES.PAYPAL) ||
      order.payedAdminApproved
    ) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "Unable to perform an operation for the current order status"
      );
    }

    const proofUrl = await this.moveUploadsFileToFolder(
      req.file,
      "paymentProofs"
    );

    const money = renterPaysCalculate(
      getPriceByDays(
        order.offerPrice,
        order.offerStartDate,
        order.offerFinishDate
      ),
      order.renterFee
    );

    let type = "created";
    let transactionId = null;
    let paymentInfo = await this.senderPaymentModel.getInfoAboutOrderPayment(
      orderId
    );
    let orderPart = { id: orderId, paymentInfo };

    await this.senderPaymentModel.deleteUnactualByPaypal(orderId);

    if (paymentInfo) {
      transactionId = paymentInfo.id;
      type = "updated";

      await this.senderPaymentModel.updateBankTransferTransactionProof(
        orderId,
        proofUrl
      );
    } else {
      transactionId = await this.senderPaymentModel.createByBankTransfer({
        money,
        userId,
        orderId,
        proofUrl,
      });

      paymentInfo = await this.senderPaymentModel.getInfoAboutOrderPayment(
        orderId
      );

      let chatId = order.chatId;
      let createMessageFunc =
        this.chatMessageModel.createRenterPayedWaitingOrderMessage;
      let messageData = {};

      await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId: userId,
        createMessageFunc,
        orderPart,
      });
    }

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      transactionId,
      type,
      ...orderPart,
    });
  };

  baseCancelOrder = async ({
    req,
    res,
    userId,
    userType,
    cancelFunc,
    createMessageFunc,
    availableStatusesToCancel = [],
  }) => {
    const { id } = req.body;
    const orderInfo = await this.orderModel.getFullWithPaymentById(id);

    if (!orderInfo) {
      return { error: { status: STATIC.ERRORS.NOT_FOUND } };
    }

    const isOwner = userType === "owner";
    const isRenter = userType === "renter";

    const isCancelByRenter = isRenter && orderInfo.renterId === userId;
    const isCancelByOwner = isOwner && orderInfo.ownerId === userId;

    if ((!isCancelByRenter && !isCancelByOwner) || orderInfo.disputeStatus) {
      return { error: { status: STATIC.ERRORS.FORBIDDEN } };
    }

    if (
      orderInfo.cancelStatus != null ||
      (orderInfo.payedId && orderInfo.payedWaitingApproved)
    ) {
      return {
        error: {
          status: STATIC.ERRORS.DATA_CONFLICT,
          message:
            "You cannot cancel an order if it has already been cancelled or is in the process of being cancelled",
        },
      };
    }

    this.sendBookingCancellationRenterMail(orderInfo.ownerEmail, orderInfo.id);

    if (!availableStatusesToCancel.includes(orderInfo.status)) {
      return {
        error: {
          status: STATIC.ERRORS.DATA_CONFLICT,
          message: "You cannot cancel an order with its current status",
        },
      };
    }

    const lastUpdateRequestInfo =
      await this.orderUpdateRequestModel.getFullForLastActive(id);

    const orderPart = {};

    if (lastUpdateRequestInfo) {
      orderPart["finishDate"] = lastUpdateRequestInfo.newFinishDate;
      orderPart["startDate"] = lastUpdateRequestInfo.newStartDate;
      orderPart["price"] = lastUpdateRequestInfo.newPrice;
      orderPart["prevFinishDate"] = orderInfo.offerFinishDate;
      orderPart["prevStartDate"] = orderInfo.offerStartDate;
      orderPart["prevPrice"] = orderInfo.offerPrice;
    }

    const cancelStatus = await cancelFunc(id, orderPart);

    let chatId = orderInfo.chatId;
    createMessageFunc = createMessageFunc;
    let messageData = {};

    orderPart["id"] = orderInfo.id;
    orderPart["cancelStatus"] = cancelStatus;

    const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
      chatId,
      messageData,
      senderId: userId,
      createMessageFunc,
      orderPart,
    });

    return {
      chatMessage,
      ...orderPart,
    };
  };

  baseFullCancelPayed = async (req) => {
    const { userId } = req.userData;
    const { id, receiptType, paypalId = null, cardNumber = null } = req.body;

    const orderInfo = await this.orderModel.getById(id);

    if (!orderInfo) {
      return { error: { status: STATIC.ERRORS.NOT_FOUND } };
    }

    const {
      renterId,
      status,
      cancelStatus,
      offerStartDate,
      offerFinishDate,
      renterFee,
      offerPrice,
    } = orderInfo;

    if (renterId != userId || orderInfo.disputeStatus) {
      return { error: { status: STATIC.ERRORS.FORBIDDEN } };
    }

    if (cancelStatus != null) {
      return {
        error: {
          status: STATIC.ERRORS.DATA_CONFLICT,
          message:
            "You cannot cancel an order if it has already been cancelled or is in the process of being cancelled",
        },
      };
    }

    if (
      ![
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
      ].includes(status)
    ) {
      return {
        error: {
          status: STATIC.ERRORS.DATA_CONFLICT,
          message: "You cannot cancel an order with the current order status",
        },
      };
    }

    const canFastCancelPayed =
      this.orderModel.canFastCancelPayedOrder(orderInfo);

    if (!canFastCancelPayed) {
      return {
        error: {
          status: STATIC.ERRORS.DATA_CONFLICT,
          message:
            "You can no longer cancel the reservation because the available time has passed",
        },
      };
    }

    const factPrice = renterPaysCalculate(
      getPriceByDays(offerPrice, offerStartDate, offerFinishDate),
      renterFee
    );

    const renterCancelFeePercent =
      await this.systemOptionModel.getRenterCancelCommissionPercent();

    const factTotalPriceWithoutCommission =
      (factPrice * (100 - renterCancelFeePercent)) / 100;

    const refundData = {
      money: factTotalPriceWithoutCommission,
      userId: userId,
      orderId: id,
      type: receiptType,
      status: STATIC.RECIPIENT_STATUSES.WAITING,
    };

    if (receiptType == STATIC.PAYMENT_TYPES.BANK_TRANSFER) {
      refundData["data"] = { cardNumber: cardNumber };
    }

    if (receiptType == STATIC.PAYMENT_TYPES.PAYPAL) {
      refundData["data"] = { paypalId: paypalId };
    }

    await this.recipientPaymentModel.createRefundPayment(refundData);

    const newCancelStatus = await this.orderModel.successCancelled(id);

    const chatId = orderInfo.chatId;
    const createMessageFunc = this.chatMessageModel.createCanceledOrderMessage;
    const messageData = {};
    const orderPart = {
      id: orderInfo.id,
      cancelStatus: newCancelStatus,
    };

    const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
      chatId,
      messageData,
      senderId: userId,
      createMessageFunc,
      orderPart,
    });

    this.sendRefundProcessMail(orderInfo.renterEmail, orderInfo.id);

    return {
      chatMessage,
      ...orderPart,
    };
  };

  fullCancelPayed = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseFullCancelPayed(req);

      if (result.error) {
        return this.sendErrorResponse(
          res,
          result.error.status,
          result.error.message ?? null
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  fullCancel = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      const result = await this.baseCancelOrder({
        req,
        res,
        userId,
        userType: "renter",
        availableStatusesToCancel: [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
        ],
        cancelFunc: this.orderModel.successCancelled,
        createMessageFunc: this.chatMessageModel.createCanceledOrderMessage,
      });

      if (result.error) {
        return this.sendErrorResponse(
          res,
          result.error.status,
          result.error.message ?? null
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  finish = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const { userId } = req.userData;

      const order = await this.orderModel.getById(id);

      if (!order) {
        return { error: { status: STATIC.ERRORS.NOT_FOUND } };
      }

      if (
        order.renterId != userId ||
        order.status != STATIC.ORDER_STATUSES.IN_PROCESS ||
        order.disputeStatus ||
        order.cancelStatus != null
      ) {
        return { error: { status: STATIC.ERRORS.FORBIDDEN } };
      }

      await this.orderModel.finish(id);

      const chatId = order.chatId;
      const createMessageFunc =
        this.chatMessageModel.createWaitingFinishedOrderMessage;
      const messageData = {};
      const orderPart = {
        id: order.id,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
      };

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId: userId,
        createMessageFunc,
        orderPart,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...orderPart,
        chatMessage,
      });
    });

  acceptFinish = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const { userId } = req.userData;

      const order = await this.orderModel.getById(id);

      if (!order) {
        return { error: { status: STATIC.ERRORS.NOT_FOUND } };
      }

      if (
        order.ownerId != userId ||
        order.status != STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED ||
        order.disputeStatus ||
        order.cancelStatus != null
      ) {
        return { error: { status: STATIC.ERRORS.FORBIDDEN } };
      }

      await this.orderModel.acceptFinish(id);

      const chatId = order.chatId;
      const createMessageFunc =
        this.chatMessageModel.createFinishedOrderMessage;
      const messageData = {};
      const orderPart = {
        id: order.id,
        status: STATIC.ORDER_STATUSES.FINISHED,
      };

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId,
        messageData,
        senderId: userId,
        createMessageFunc,
        orderPart,
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        ...orderPart,
        chatMessage,
      });
    });

  generateInvoicePdf = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const order = await this.orderModel.getFullById(id);

      if (!order || order.renterId != userId) {
        return res.sendStatus(404);
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

      await invoicePdfGeneration(
        {
          orderOfferStartDate: order.offerStartDate,
          orderOfferFinishDate: order.offerFinishDate,
          orderOfferPrice: order.offerPrice,
          renterFee: order.renterFee,
          ownerFee: order.ownerFee,
          listingAddress: order.listingAddress,
          listingCity: order.listingCity,
          orderId: order.id,
          listingName: order.listingName,
          adminApproved: false,
          dueAt: null,
        },
        res
      );
    });

  wrapOrderFullInfo = async (order, userId) => {
    order["actualUpdateRequest"] =
      await this.orderUpdateRequestModel.getActualRequestInfo(order.id);

    order["previousUpdateRequest"] =
      await this.orderUpdateRequestModel.getPreviousRequestInfo(order.id);

    order["renterCountItems"] = await this.listingModel.getRenterCountListings(
      order.renterId
    );

    order["ownerCountItems"] = await this.listingModel.getOwnerCountListings(
      order.ownerId
    );

    return order;
  };
}

module.exports = OrderController;
