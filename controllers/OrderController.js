const STATIC = require("../static");
const {
  generateDatesBetween,
  getPaypalOrderInfo,
  capturePaypalOrder,
  sendMoneyToPaypalByPaypalID,
  tenantPaymentCalculate,
  getDaysDifference,
} = require("../utils");
const Controller = require("./Controller");
const fs = require("fs");

class OrderController extends Controller {
  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;

      const order = await this.orderModel.getFullById(id);

      if (!order || (userId != order.tenantId && userId != order.ownerId)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (order.status === STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
        order["payedInfo"] = await this.senderPaymentModel.getInfoByOrderId(
          order.id
        );
      }

      order["extendOrders"] = await this.orderModel.getOrdersExtends([id]);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  baseCreate = async ({
    pricePerDay,
    startDate,
    endDate,
    listingId,
    feeActive,
    message,
    tenantId,
    orderParentId = null,
  }) => {
    const tenantFee =
      await this.systemOptionModel.getTenantBaseCommissionPercent();
    const ownerFee =
      await this.systemOptionModel.getOwnerBaseCommissionPercent();

    const blockedDatesListings =
      await this.orderModel.getBlockedListingsDatesForUser(
        [listingId],
        tenantId
      );

    const blockedDates = blockedDatesListings[listingId];

    const selectedDates = generateDatesBetween(startDate, endDate);

    const hasBlockedDate = selectedDates.find((selectedDate) =>
      blockedDates.includes(selectedDate)
    );

    if (hasBlockedDate) {
      throw new Error("The selected date is not available for booking");
    }

    return await this.orderModel.create({
      pricePerDay,
      startDate,
      endDate,
      listingId,
      tenantId,
      ownerFee: ownerFee,
      tenantFee: tenantFee,
      feeActive,
      message,
      orderParentId,
    });
  };

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { pricePerDay, startDate, endDate, listingId, feeActive, message } =
        req.body;
      const tenantId = req.userData.userId;

      const createdOrderId = await this.baseCreate({
        pricePerDay,
        startDate,
        endDate,
        listingId,
        feeActive,
        message,
        tenantId,
      });

      const listing = await this.listingModel.getFullById(listingId);

      this.sendBookingApprovalRequestMail(listing.userEmail);

      const firstImage = listing.listingImages[0];
      const ownerId = listing.ownerId;

      const createdMessages = await this.chatModel.createForOrder({
        ownerId,
        tenantId,
        orderInfo: {
          orderId: createdOrderId,
          listingName: listing.name,
          offerPrice: pricePerDay,
          listingPhotoPath: firstImage?.link,
          listingPhotoType: firstImage?.type,
          offerDateStart: startDate,
          offerDateEnd: endDate,
          description: message,
        },
      });

      await this.sendMessageForOrder(createdMessages[ownerId], tenantId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        {
          id: createdOrderId,
        }
      );
    });

  extend = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        pricePerDay,
        startDate,
        endDate,
        listingId,
        feeActive,
        message,
        parentOrderId,
      } = req.body;
      const tenantId = req.userData.userId;

      const prevOrder = await this.orderModel.getLastActive(parentOrderId);

      if (
        !prevOrder ||
        prevOrder.tenantId != tenantId ||
        prevOrder.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER ||
        prevOrder.disputeStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const prevOrderEndDate = prevOrder.offerEndDate;

      const dataToCreate = {
        pricePerDay,
        startDate,
        endDate,
        listingId,
        feeActive,
        message,
        tenantId,
      };

      if (getDaysDifference(prevOrderEndDate, startDate) == 2) {
        dataToCreate["orderParentId"] = prevOrder.orderParentId
          ? prevOrder.orderParentId
          : parentOrderId;
      }

      const createdOrderId = await this.baseCreate(dataToCreate);

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
    const userId = req.userData.userId;

    const type = req.body.type == "owner" ? "owner" : "tenant";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      totalCountCall(filter, timeInfos)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await listCall(options);

    const requestsWithImages = await this.listingModel.listingsBindImages(
      requests,
      "listingId"
    );

    const orderIds = requestsWithImages.map((request) => request.id);
    const conflictOrders = await this.orderModel.getConflictOrders(orderIds);

    const paymentInfos =
      await this.senderPaymentModel.getInfoAboutOrdersPayments(orderIds);

    const orderListingIds = Array.from(
      new Set(requestsWithImages.map((request) => request.listingId))
    );

    const blockedListingsDates =
      await this.orderModel.getBlockedListingsDatesForUser(
        orderListingIds,
        userId
      );

    requestsWithImages.forEach((request, index) => {
      const currentOrderConflicts = conflictOrders[request.id];
      requestsWithImages[index]["conflictOrders"] = currentOrderConflicts;

      requestsWithImages[index]["blockedDates"] =
        this.orderModel.generateBlockedDatesByOrders(currentOrderConflicts);

      requestsWithImages[index]["blockedForRentalDates"] =
        blockedListingsDates[request.listingId];

      requestsWithImages[index]["paymentInfo"] = paymentInfos[request.id];
    });

    const orderIdsNeedExtendInfoObj = {};

    requestsWithImages.forEach((request) => {
      if (request.parentId) {
        orderIdsNeedExtendInfoObj[request.parentId] = true;
      } else {
        orderIdsNeedExtendInfoObj[request.id] = true;
      }
    });

    const orderIdsNeedExtendInfo = Object.keys(orderIdsNeedExtendInfoObj);
    const orderExtends = await this.orderModel.getOrdersExtends(
      orderIdsNeedExtendInfo
    );

    requestsWithImages.forEach((request, index) => {
      requestsWithImages[index]["canFastCancelPayed"] =
        this.orderModel.canFastCancelPayedOrder(request);

      requestsWithImages[index]["canFinalization"] =
        this.orderModel.canFinalizationOrder(request);

      requestsWithImages[index]["extendOrders"] = [];

      orderExtends.forEach((extendOrder) => {
        if (extendOrder.orderParentId == request.id) {
          requestsWithImages[index]["extendOrders"].push(extendOrder);
        }
      });
    });

    let requestsWithRatingImages = await this.bindOrderRating(
      requestsWithImages
    );

    requestsWithRatingImages =
      await this.listingModel.bindTenantListCountListings(
        requestsWithRatingImages,
        "tenantId"
      );

    requestsWithRatingImages =
      await this.listingModel.bindOwnerListCountListings(
        requestsWithRatingImages,
        "tenantId"
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

    const orderIds = orders.map((order) => order.id);

    const orderCheckLists = await this.orderModel.orderCheckListByIds(orderIds);

    orders.forEach((order, index) => {
      orders[index]["listingRentalCount"] = listingCounts[order.listingId];
      orders[index]["orderCheckLists"] = orderCheckLists[order.id];
    });

    return orders;
  };

  bindOrderRating = async (orders) => {
    orders = await this.tenantCommentModel.bindAverageForKeyEntities(
      orders,
      "tenantId",
      {
        commentCountName: "tenantCommentCount",
        averageRatingName: "tenantAverageRating",
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

    orders = await this.listingCommentModel.bindAverageForKeyEntities(
      orders,
      "listingId",
      {
        commentCountName: "listingCommentCount",
        averageRatingName: "listingAverageRating",
      }
    );

    return orders;
  };

  baseTenantOrderList = async (req) => {
    const tenantId = req.userData.userId;

    const totalCountCall = (filter, timeInfos) =>
      this.orderModel.tenantOrdersTotalCount(filter, timeInfos, tenantId);

    const listCall = (options) => {
      options["tenantId"] = tenantId;
      return this.orderModel.tenantOrdersList(options);
    };

    return await this.baseRequestsList(req, totalCountCall, listCall);
  };

  baseListingOwnerOrderList = async (req) => {
    const ownerId = req.userData.userId;

    const totalCountCall = (filter, timeInfos) =>
      this.orderModel.ownerOrdersTotalCount(filter, timeInfos, ownerId);

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

  allList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const totalCountCall = (filter, timeInfos) =>
        this.orderModel.fullTotalCount(filter, timeInfos);

      const listCall = (options) => {
        return this.orderModel.fullList(filter, timeInfos);
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

      if (
        (order.tenantId != userId && order.ownerId != userId) ||
        order.disputeStatus
      ) {
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

      const conflictOrders = await this.orderModel.getConflictOrders([id]);

      if (conflictOrders[`${id}`].length > 0) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "Order has conflict orders"
        );
      }

      let resetParentId = false;

      if (order.orderParentId) {
        const parentOrder = await this.orderModel.getLastActive(
          order.orderParentId
        );
        const dateDiff = getDaysDifference(
          parentOrder.offerEndDate,
          order.offerStartDate
        );

        if (dateDiff != 2) {
          resetParentId = true;
        }
      }

      if (lastUpdateRequestInfo) {
        await this.orderModel.acceptUpdateRequest(id, {
          newStartDate: lastUpdateRequestInfo.newStartDate,
          newEndDate: lastUpdateRequestInfo.newEndDate,
          newPricePerDay: lastUpdateRequestInfo.newPricePerDay,
          prevPricePerDay: order.offerPricePerDay,
          prevStartDate: order.offerStartDate,
          prevEndDate: order.offerEndDate,
          orderParentId: resetParentId ? null : undefined,
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

      if (
        (order.tenantId != userId && order.ownerId != userId) ||
        order.disputeStatus
      ) {
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
        await this.orderModel.successCancelled(id, newData);
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

      const payerCardLastDigits =
        paypalOrderInfo.payment_source?.card?.last_digits;
      const payerCardLastBrand = paypalOrderInfo.payment_source?.card?.brand;

      const paypalSenderId = paypalOrderInfo.payment_source.paypal?.account_id;
      const orderId = paypalOrderInfo.purchase_units[0].items[0].sku;

      const order = await this.orderModel.getById(orderId);

      if (order.tenantId != userId || order.disputeStatus) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const paypalCaptureId =
        paypalOrderInfo.purchase_units[0].payments.captures[0].id;

      const amount = paypalOrderInfo.purchase_units[0].amount.value;

      const { token, image: generatedImage } = await this.generateQrCodeInfo(
        order.orderParentId
          ? STATIC.ORDER_OWNER_GOT_ITEM_APPROVE_URL
          : STATIC.ORDER_TENANT_GOT_ITEM_APPROVE_URL
      );

      if (order.orderParentId) {
        await this.orderModel.orderTenantGotListing(orderId, {
          token,
          qrCode: generatedImage,
        });
      } else {
        await this.orderModel.orderTenantPayed(orderId, {
          token,
          qrCode: generatedImage,
        });
      }

      await this.senderPaymentModel.createByPaypal({
        money: amount,
        userId: userId,
        orderId: orderId,
        paypalSenderId: paypalSenderId,
        paypalOrderId: paypalOrderId,
        paypalCaptureId: paypalCaptureId,
        payerCardLastDigits,
        payerCardLastBrand,
        proofUrl: "",
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  unpaidTransactionByCreditCard = async (req, res) => {
    const { userId } = req.userData;
    const { orderId } = req.body;

    const order = await this.orderModel.getById(orderId);

    if (order.tenantId != userId || order.disputeStatus) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    const proofUrl = this.moveUploadsFileToFolder(req.file, "paymentProofs");

    const money = tenantPaymentCalculate(
      order.offerStartDate,
      order.offerEndDate,
      order.tenantFee,
      order.offerPricePerDay
    );

    let type = "created";
    let transactionId = null;
    const paymentInfo = await this.senderPaymentModel.getInfoAboutOrderPayment(
      orderId
    );

    if (paymentInfo) {
      transactionId = paymentInfo.id;
      type = "updated";

      await this.senderPaymentModel.updateCreditCardTransactionProof(
        orderId,
        proofUrl
      );
    } else {
      transactionId = await this.senderPaymentModel.createByCreditCard({
        money,
        userId,
        orderId,
        proofUrl,
      });
    }

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      transactionId,
      type,
    });
  };

  approveClientGotListing = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token, questions } = req.body;
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

      if (
        !orderInfo ||
        orderInfo.tenantId != userId ||
        orderInfo.disputeStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const { token: ownerToken, image: generatedImage } =
        await this.generateQrCodeInfo(STATIC.ORDER_OWNER_GOT_ITEM_APPROVE_URL);

      await this.orderModel.generateDefectFromTenantQuestionList(
        questions,
        orderInfo.id
      );

      await this.orderModel.orderTenantGotListing(orderInfo.id, {
        token: ownerToken,
        qrCode: generatedImage,
      });

      await this.recipientPaymentModel.paypalPaymentPlanGeneration({
        startDate: orderInfo.offerStartDate,
        endDate: orderInfo.offerEndDate,
        pricePerDay: orderInfo.offerPricePerDay,
        userId: orderInfo.ownerId,
        orderId: orderInfo.id,
        fee: orderInfo.ownerFee,
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

    if ((!isCancelByTenant && !isCancelByOwner) || orderInfo.disputeStatus) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    if (orderInfo.cancelStatus != null) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "You cannot cancel an order if it has already been cancelled or is in the process of being cancelled"
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
      (userType === "tenant" &&
        orderInfo.cancelStatus !=
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE) ||
      orderInfo.disputeStatus
    ) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "You cannot cancel an order if it has already been cancelled or is in the process of being cancelled"
      );
    }

    const isOwner = userType === "owner";
    const isTenant = userType === "tenant";

    const isAcceptCancelByTenant = isTenant && orderInfo.tenantId === userId;
    const isAcceptCancelByOwner = isOwner && orderInfo.ownerId === userId;

    if (!isAcceptCancelByTenant && !isAcceptCancelByOwner) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    /*const tenantInfo = await this.userModel.getById(orderInfo.tenantId);

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
        data: {paypalId: tenantInfo.paypalId},
      });
    }*/

    await this.orderModel.successCancelled(id);

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
      const { id, type, paypalId = null, cardNumber = null } = req.body;

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

      if (tenantId != userId || orderInfo.disputeStatus) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (cancelStatus != null) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot cancel an order if it has already been cancelled or is in the process of being cancelled"
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

      const factTotalPrice = tenantPaymentCalculate(
        offerStartDate,
        offerEndDate,
        tenantFee,
        offerPricePerDay
      );

      const tenantCancelFeePercent =
        await this.systemOptionModel.getTenantCancelCommissionPercent();

      const factTotalPriceWithoutCommission =
        (factTotalPrice * (100 - tenantCancelFeePercent)) / 100;

      if (type == "paypal") {
        try {
          await sendMoneyToPaypalByPaypalID(
            paypalId,
            factTotalPriceWithoutCommission
          );

          await this.recipientPaymentModel.createRefundPayment({
            money: factTotalPriceWithoutCommission,
            userId: userId,
            orderId: id,
            type: "paypal",
            data: { paypalId: paypalId },
            status: STATIC.RECIPIENT_STATUSES.COMPLETED,
          });
        } catch (e) {
          await this.recipientPaymentModel.createRefundPayment({
            money: factTotalPriceWithoutCommission,
            userId: userId,
            orderId: id,
            type: "paypal",
            data: { paypalId: paypalId },
            status: STATIC.RECIPIENT_STATUSES.FAILED,
            failedDescription: e.message,
          });
        }
      }

      if (type == "card") {
        await this.recipientPaymentModel.createRefundPayment({
          money: factTotalPriceWithoutCommission,
          userId: userId,
          orderId: id,
          type: "card",
          data: { cardNumber: cardNumber },
          status: STATIC.RECIPIENT_STATUSES.WAITING,
        });
      }

      await this.orderModel.successCancelled(id);

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
        cancelFunc: this.orderModel.successCancelled,
      });
    });

  finishedByOwner = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;

      const { token, questions } = req.body;

      const orderInfo = await this.orderModel.getFullByOwnerListingToken(token);

      if (
        !orderInfo ||
        orderInfo.ownerId !== userId ||
        orderInfo.disputeStatus
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (orderInfo.cancelStatus != null) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot finished an order if it has already been cancelled or is in the process of being cancelled"
        );
      }

      if (orderInfo.status !== STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "You cannot finished an order with its current status"
        );
      }

      await this.orderModel.generateDefectFromOwnerQuestionList(
        questions,
        orderInfo.id
      );

      await this.orderModel.orderFinished(token);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  generateInvoicePdf = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const order = await this.orderModel.getFullById(id);

      if (!order || order.tenantId != userId) {
        return res.send(404);
      }

      const buffer = await this.baseInvoicePdfGeneration({
        orderOfferStartDate: order.offerStartDate,
        orderOfferEndDate: order.offerEndDate,
        orderOfferPricePerDay: order.offerPricePerDay,
        tenantFee: order.tenantFee,
        listingAddress: order.listingAddress,
        listingCity: order.listingCity,
        orderId: order.id,
        listingName: order.listingName,
        adminApproved: false,
        dueAt: null,
      });
      res.contentType("application/pdf");
      res.send(buffer);
    });

  wrapOrderFullInfo = async (order, userId) => {
    const resGetConflictOrders = await this.orderModel.getConflictOrders([
      order.id,
    ]);

    order["extendOrders"] = await this.orderModel.getOrdersExtends([order.id]);

    const conflictOrders = resGetConflictOrders[order.id];
    order["blockedDates"] =
      this.orderModel.generateBlockedDatesByOrders(conflictOrders);

    const blockedListingsDates =
      await this.orderModel.getBlockedListingsDatesForUser(
        [order.listingId],
        userId
      );

    order["blockedForRentalDates"] = blockedListingsDates[order.listingId];

    if (userId == order.ownerId) {
      order["conflictOrders"] = conflictOrders;
      order["ownerAcceptListingQrcode"] = null;
    } else {
      order["tenantAcceptListingQrcode"] = null;
    }

    order["actualUpdateRequest"] =
      await this.orderUpdateRequestModel.getActualRequestInfo(order.id);

    order["previousUpdateRequest"] =
      await this.orderUpdateRequestModel.getPreviousRequestInfo(order.id);

    order["tenantCountItems"] = await this.listingModel.getTenantCountListings(
      order.tenantId
    );

    order["ownerCountItems"] = await this.listingModel.getOwnerCountListings(
      order.ownerId
    );

    return order;
  };
}

module.exports = OrderController;
