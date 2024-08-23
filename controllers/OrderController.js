const STATIC = require("../static");
const {
  getPaypalOrderInfo,
  capturePaypalOrder,
  tenantPaymentCalculate,
  getDaysDifference,
  removeDuplicates,
  checkStartEndHasConflict,
  isOrderCanBeAccepted,
} = require("../utils");
const Controller = require("./Controller");
const fs = require("fs");

class OrderController extends Controller {
  getChecklistImages = async (req) => {
    const imagesToSave = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      if (fs.existsSync(file.path)) {
        const filePath = await this.moveUploadsFileToFolder(file, "checklists");
        imagesToSave.push({ type: "storage", link: filePath });
      }
    }

    return [...imagesToSave];
  };

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

      if (!order || (userId != order.tenantId && userId != order.ownerId)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (order.status === STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT) {
        order["payedInfo"] = await this.senderPaymentModel.getInfoByOrderId(
          order.id
        );
      }

      order["extendOrders"] = await this.orderModel.getOrdersExtends(
        order.orderParentId ?? id
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  baseCreate = async (
    {
      startDate,
      endDate,
      listingId,
      feeActive,
      tenantId,
      orderParentId = null,
    },
    needMinDateVerify = true
  ) => {
    let minRentalDays = null;

    const listing = await this.listingModel.getLightById(listingId);

    if (!listing) {
      return { error: "Listing not found", orderId: null };
    }

    if (needMinDateVerify) {
      minRentalDays = listing.minRentalDays;
    }

    if (!listing.approved || !listing.active || listing.ownerId == tenantId) {
      return { error: "Access denied", orderId: null };
    }

    const dateErrorMessage = this.baseListingDatesValidation(
      startDate,
      endDate,
      minRentalDays
    );

    if (dateErrorMessage) {
      return { error: dateErrorMessage, orderId: null };
    }

    const tenantFee =
      await this.systemOptionModel.getTenantBaseCommissionPercent();
    const ownerFee =
      await this.systemOptionModel.getOwnerBaseCommissionPercent();

    const blockedDatesListings =
      await this.orderModel.getBlockedListingsDatesForListings([listingId]);

    const blockedDates = blockedDatesListings[listingId];

    if (checkStartEndHasConflict(startDate, endDate, blockedDates)) {
      return {
        error: "The selected date is not available for booking",
        orderId: null,
      };
    }

    const orderId = await this.orderModel.create({
      pricePerDay: listing.pricePerDay,
      startDate,
      endDate,
      listingId,
      tenantId,
      ownerFee: ownerFee,
      tenantFee: tenantFee,
      feeActive,
      orderParentId,
    });

    return {
      error: null,
      orderId,
      pricePerDay: listing.pricePerDay,
    };
  };

  baseCreateWithMessageSend = async (req, needReturnMessage = false) => {
    const { startDate, endDate, listingId, feeActive, message } = req.body;
    const tenantId = req.userData.userId;

    const result = await this.baseCreate({
      startDate,
      endDate,
      listingId,
      feeActive,
      tenantId,
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

    this.sendBookingApprovalRequestMail(listing.userEmail);

    const firstImage = listing.listingImages[0];
    const ownerId = listing.ownerId;

    const createdMessage = await this.chatModel.createForOrder({
      ownerId,
      tenantId,
      orderInfo: {
        orderId: createdOrderId,
        listingName: listing.name,
        offerPrice: result.pricePerDay,
        listingPhotoPath: firstImage?.link,
        listingPhotoType: firstImage?.type,
        offerStartDate: startDate,
        offerEndDate: endDate,
        description: message,
      },
    });

    await this.sendMessageForNewOrder({
      message: createdMessage,
      senderId: tenantId,
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

  extend = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        startDate,
        endDate,
        listingId,
        feeActive,
        message,
        parentOrderId,
      } = req.body;

      const tenantId = req.userData.userId;

      const prevOrder = await this.orderModel.getLastActive(parentOrderId);

      if (prevOrder) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "You can't extend order with unfinished order"
        );
      }

      const order = await this.orderModel.getById(parentOrderId);

      if (
        order.status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER ||
        order.tenantId != tenantId
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const hasUnstartedExtension =
        await this.orderModel.checkOrderHasUnstartedExtension(parentOrderId);

      if (hasUnstartedExtension) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Owner of the item has to confirm your previous request for extension"
        );
      }

      const orderEndDate = order.offerEndDate;

      const dataToCreate = {
        startDate,
        endDate,
        listingId,
        feeActive,
        tenantId,
      };

      let needMinDateVerify = true;

      const parentOrder = await this.orderModel.getFullById(
        order.orderParentId ? order.orderParentId : parentOrderId
      );

      if (getDaysDifference(orderEndDate, startDate) != 1) {
        const result = await this.baseCreateWithMessageSend(req, true);

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
      }

      dataToCreate["orderParentId"] = parentOrder.id;
      needMinDateVerify = false;

      const result = await this.baseCreate(dataToCreate, needMinDateVerify);

      if (result.error) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          result.error
        );
      }

      const createdOrderId = result.orderId;

      this.sendBookingApprovalRequestMail(parentOrder.ownerEmail);

      const firstImage = parentOrder.listingImages[0];

      const parentOrderExtendOrders = await this.orderModel.getOrderExtends(
        parentOrder.id
      );

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId: parentOrder.chatId,
        messageData: {
          listingName: parentOrder.listingName,
          offerPrice: result.pricePerDay,
          listingPhotoPath: firstImage?.link,
          listingPhotoType: firstImage?.type,
          offerStartDate: startDate,
          offerEndDate: endDate,
          description: message,
          extensionId: result.orderId,
        },
        senderId: tenantId,
        createMessageFunc: this.chatMessageModel.createExtensionMessage,
        orderPart: {
          id: parentOrder.id,
          extendOrders: parentOrderExtendOrders,
        },
      });

      this.sendBookingExtensionMail(order.ownerEmail, order.id);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        {
          id: createdOrderId,
          chatMessage,
          parentOrderExtendOrders,
        }
      );
    });

  baseRequestsList = async (req, totalCountCall, listCall) => {
    const type = req.body.type == "owner" ? "owner" : "tenant";
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

    const conflictOrders = await this.orderModel.getConflictOrders(orderIds);

    const paymentInfos =
      await this.senderPaymentModel.getInfoAboutOrdersPayments(orderIds);

    requestsWithImages.forEach((request, index) => {
      const currentOrderConflicts = conflictOrders[request.id];
      requestsWithImages[index]["conflictOrders"] = currentOrderConflicts;
      requestsWithImages[index]["paymentInfo"] = paymentInfos[request.id];
    });

    const orderIdsNeedExtendInfoObj = {};

    requestsWithImages.forEach((request) => {
      if (request.orderParentId) {
        orderIdsNeedExtendInfoObj[request.orderParentId] = true;
      } else {
        orderIdsNeedExtendInfoObj[request.id] = true;
      }
    });

    const orderIdsNeedExtendInfo = Object.keys(orderIdsNeedExtendInfoObj);

    const orderExtends = await this.orderModel.getOrdersExtends(
      orderIdsNeedExtendInfo
    );

    const extendOrderIds = orderExtends.map((request) => request.id);
    const extendConflictOrders = await this.orderModel.getConflictOrders(
      extendOrderIds
    );

    const extendPaymentInfos =
      await this.senderPaymentModel.getInfoAboutOrdersPayments(extendOrderIds);

    orderExtends.forEach((request, index) => {
      orderExtends[index]["paymentInfo"] = extendPaymentInfos[request.id];
      orderExtends[index]["conflictOrders"] = extendConflictOrders[request.id];

      orderExtends[index]["canFastCancelPayed"] =
        this.orderModel.canFastCancelPayedOrder(request);

      orderExtends[index]["canFinalization"] =
        this.orderModel.canFinalizationOrder(request);
    });

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

    orders.forEach((order, index) => {
      orders[index]["listingRentalCount"] = listingCounts[order.listingId];
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

    return orders;
  };

  baseTenantOrderList = async (req) => {
    const tenantId = req.userData.userId;

    const totalCountCall = (filter) =>
      this.orderModel.tenantOrdersTotalCount(filter, tenantId);

    const listCall = (options) => {
      options["tenantId"] = tenantId;
      return this.orderModel.tenantOrdersList(options);
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
    const isForTenant = req.body.type !== "owner";

    const request = isForTenant
      ? this.baseTenantOrderList
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
          (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT &&
            order.tenantId == userId)
        )
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (order.cancelStatus || order.disputeStatus) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastUpdateRequestInfo =
        await this.orderUpdateRequestModel.getFullForLastActive(id);

      const conflictOrders = await this.orderModel.getConflictOrders([id]);

      if (!isOrderCanBeAccepted(order, conflictOrders[id])) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Order has conflict orders"
        );
      }

      let resetParentId = false;

      if (order.orderParentId) {
        const parentOrder = await this.orderModel.getById(order.orderParentId);

        const dateDiff = getDaysDifference(
          parentOrder.offerEndDate,
          lastUpdateRequestInfo?.newStartDate ?? order.offerStartDate
        );

        if (dateDiff != 1) {
          resetParentId = true;
        }
      }

      let currentStartDate = order.offerStartDate;
      let currentEndDate = order.offerEndDate;
      let currentPricePerDay = order.offerPricePerDay;

      if (lastUpdateRequestInfo) {
        currentStartDate = lastUpdateRequestInfo.newStartDate;
        currentEndDate = lastUpdateRequestInfo.newEndDate;
        currentPricePerDay = lastUpdateRequestInfo.newPricePerDay;

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

      const newStatus = STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT;

      if (resetParentId) {
        this.sendBookingApprovalRequestMail(order.ownerEmail);

        console.log(order);

        const firstImage = order.listingImages[0];
        const ownerId = order.ownerId;
        const tenantId = order.tenantId;

        const createdMessage = await this.chatModel.createForOrder({
          ownerId,
          tenantId,
          orderInfo: {
            orderId: order.id,
            listingName: order.listingName,
            offerPrice: currentPricePerDay,
            listingPhotoPath: firstImage?.link,
            listingPhotoType: firstImage?.type,
            offerStartDate: currentStartDate,
            offerEndDate: currentEndDate,
            description: order.description,
          },
        });

        await this.sendMessageForNewOrder({
          message: createdMessage,
          senderId: tenantId,
        });

        await this.sendMessageForNewOrder({
          message: createdMessage,
          senderId: tenantId,
          opponentId: ownerId,
        });

        const parentOrderExtensions = await this.orderModel.getOrderExtends(
          order.orderParentId
        );

        const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
          chatId: order.parentChatId,
          messageData: {
            extensionId: order.id,
            extensionChatId: createdMessage.chatId,
            listingName: order.listingName,
            offerPrice: currentPricePerDay,
            listingPhotoPath: firstImage?.link,
            listingPhotoType: firstImage?.type,
            offerStartDate: currentStartDate,
            offerEndDate: currentEndDate,
            description: order.description,
          },
          senderId: userId,
          createMessageFunc:
            this.chatMessageModel.createNewOrderByExtensionMessage,
          orderPart: {
            id: order.orderParentId,
            extendOrders: parentOrderExtensions,
          },
        });

        this.sendAssetPickupMail(order.tenantEmail, order.id);

        return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
          chatMessage,
          status: newStatus,
        });
      } else {
        let chatId = order.chatId;
        let createMessageFunc =
          this.chatMessageModel.createAcceptedOrderMessage;
        let messageData = {};
        let orderPart = {
          id: order.id,
          status: newStatus,
        };

        if (order.orderParentId) {
          chatId = order.parentChatId;
          createMessageFunc =
            this.chatMessageModel.createAcceptedExtensionMessage;

          messageData = {
            extensionId: order.id,
            offerStartDate: currentStartDate,
            offerEndDate: currentEndDate,
            offerPrice: currentPricePerDay,
          };

          const parentOrderExtensions = await this.orderModel.getOrderExtends(
            order.orderParentId
          );

          orderPart = {
            id: order.orderParentId,
            extendOrders: parentOrderExtensions,
          };
        }

        const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
          chatId,
          messageData,
          senderId: userId,
          createMessageFunc,
          orderPart,
        });

        this.sendAssetPickupMail(order.tenantEmail, order.id);

        return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
          chatMessage,
          ...orderPart,
        });
      }
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
        ((order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT &&
            !(order.payedId && order.payedWaitingApproved))) &&
          order.ownerId == userId) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT &&
          order.tenantId == userId)
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

    let newStatus = null;
    let newCancelStatus = null;

    if (order.tenantId == userId) {
      await this.orderModel.successCancelled(id, newData);
      newStatus = STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
    } else {
      await this.orderModel.rejectOrder(id, newData);
      newCancelStatus = STATIC.ORDER_STATUSES.REJECTED;
      newStatus = order.status;
    }

    await this.orderUpdateRequestModel.closeLast(id);

    let chatId = order.chatId;
    let createMessageFunc = this.chatMessageModel.createRejectedOrderMessage;
    let messageData = {};
    let orderPart = {
      id: order.id,
      status: newStatus,
      cancelStatus: newCancelStatus,
    };

    if (order.orderParentId) {
      chatId = order.parentChatId;
      createMessageFunc = this.chatMessageModel.createRejectedExtensionMessage;
      messageData = {
        extensionId: order.id,
        offerStartDate: order.offerStartDate,
        offerEndDate: order.offerEndDate,
        offerPrice: order.offerPricePerDay,
      };

      const parentOrderExtensions = await this.orderModel.getOrderExtends(
        order.orderParentId
      );

      orderPart = {
        id: order.orderParentId,
        extendOrders: parentOrderExtensions,
      };
    }

    const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
      chatId,
      messageData,
      senderId: userId,
      createMessageFunc,
      orderPart,
    });

    this.sendBookingCancellationOwnerMail(order.tenantEmail, order.id);

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
        payment.tenantId != userId ||
        payment.disputeStatus ||
        payment.orderStatus !== STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const paypalCaptureId =
        paypalOrderInfo.purchase_units[0].payments.captures[0].id;

      let newStatus = null;

      if (payment.orderParentId) {
        newStatus = await this.orderModel.orderFinishedById(orderId);

        await this.recipientPaymentModel.paypalPaymentPlanGeneration({
          startDate: payment.offerStartDate,
          endDate: payment.offerEndDate,
          pricePerDay: payment.offerPricePerDay,
          userId: payment.ownerId,
          orderId: payment.orderId,
          fee: payment.ownerFee,
        });
      } else {
        const { token: tenantToken, image: generatedImage } =
          await this.generateQrCodeInfo(
            STATIC.ORDER_TENANT_GOT_ITEM_APPROVE_URL
          );

        newStatus = await this.orderModel.orderTenantPayed(orderId, {
          token: tenantToken,
          qrCode: generatedImage,
        });
      }

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
        this.chatMessageModel.createTenantPayedOrderMessage;
      let messageData = {};
      let orderPart = {
        id: orderId,
        status: newStatus,
      };

      if (payment.orderParentId) {
        chatId = payment.parentChatId;
        createMessageFunc =
          this.chatMessageModel.createTenantPayedExtensionMessage;
        messageData = {
          extensionId: orderId,
          offerStartDate: payment.offerStartDate,
          offerEndDate: payment.offerEndDate,
          offerPrice: payment.offerPricePerDay,
        };

        const parentOrderExtensions = await this.orderModel.getOrderExtends(
          payment.orderParentId
        );

        orderPart = {
          id: payment.orderParentId,
          extendOrders: parentOrderExtensions,
          offerEndDate: payment.offerEndDate,
        };

        await this.orderModel.orderUpdateEndDate(
          payment.orderParentId,
          payment.offerEndDate
        );
      }

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

    if (order.tenantId != userId) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }

    if (
      order.cancelStatus ||
      order.disputeStatus ||
      order.status !== STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT ||
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

    const money = tenantPaymentCalculate(
      order.offerStartDate,
      order.offerEndDate,
      order.tenantFee,
      order.offerPricePerDay
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
        this.chatMessageModel.createTenantPayedWaitingOrderMessage;
      let messageData = {};

      if (order.orderParentId) {
        chatId = order.parentChatId;
        createMessageFunc =
          this.chatMessageModel.createTenantPayedWaitingExtensionMessage;
        messageData = {
          extensionId: order.id,
          offerStartDate: order.offerStartDate,
          offerEndDate: order.offerEndDate,
          offerPrice: order.offerPricePerDay,
        };

        const parentOrderExtensions = await this.orderModel.getOrderExtends(
          order.orderParentId
        );

        orderPart = {
          id: order.orderParentId,
          extendOrders: parentOrderExtensions,
        };
      }

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

  approveTenantGotListing = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        token,
        itemMatchesDescription = null,
        itemMatchesPhotos = null,
        itemFullyFunctional = null,
        partsGoodCondition = null,
        providedGuidelines = null,
      } = req.body;
      const { userId } = req.userData;

      const orderInfo = await this.orderModel.getFullByTenantListingToken(
        token
      );

      if (!orderInfo || orderInfo.tenantId != userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      if (
        orderInfo.status !== STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT ||
        orderInfo.cancelStatus ||
        orderInfo.disputeStatus
      ) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "Unable to perform an operation for the current order status"
        );
      }

      const checklistImages = await this.getChecklistImages(req);

      await this.checklistModel.createByTenant({
        itemMatchesDescription,
        itemMatchesPhotos,
        itemFullyFunctional,
        partsGoodCondition,
        providedGuidelines,
        orderId: orderInfo.id,
        images: checklistImages,
      });

      const { token: ownerToken, image: generatedImage } =
        await this.generateQrCodeInfo(STATIC.ORDER_OWNER_GOT_ITEM_APPROVE_URL);

      const newStatus = await this.orderModel.orderTenantGotListing(
        orderInfo.id,
        {
          token: ownerToken,
          qrCode: generatedImage,
        }
      );

      await this.recipientPaymentModel.paypalPaymentPlanGeneration({
        startDate: orderInfo.offerStartDate,
        endDate: orderInfo.offerEndDate,
        pricePerDay: orderInfo.offerPricePerDay,
        userId: orderInfo.ownerId,
        orderId: orderInfo.id,
        fee: orderInfo.ownerFee,
      });

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId: orderInfo.chatId,
        messageData: {},
        senderId: userId,
        createMessageFunc:
          this.chatMessageModel.createPendedToTenantOrderMessage,
        orderPart: {
          id: orderInfo.id,
          status: newStatus,
        },
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        orderPart: { id: orderInfo.id, status: newStatus },
        qrCode: generatedImage,
      });
    });

  baseCancelOrder = async ({
    req,
    res,
    userId,
    userType,
    cancelFunc,
    createMessageFunc,
    createMessageFuncIfExtension = null,
    availableStatusesToCancel = [],
  }) => {
    const { id } = req.body;
    const orderInfo = await this.orderModel.getFullWithPaymentById(id);

    if (!orderInfo) {
      return { error: { status: STATIC.ERRORS.NOT_FOUND } };
    }

    const isOwner = userType === "owner";
    const isTenant = userType === "tenant";

    const isCancelByTenant = isTenant && orderInfo.tenantId === userId;
    const isCancelByOwner = isOwner && orderInfo.ownerId === userId;

    if ((!isCancelByTenant && !isCancelByOwner) || orderInfo.disputeStatus) {
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

    let newData = {};

    if (lastUpdateRequestInfo) {
      newData = {
        newStartDate: lastUpdateRequestInfo.newStartDate,
        newEndDate: lastUpdateRequestInfo.newEndDate,
        newPricePerDay: lastUpdateRequestInfo.newPricePerDay,
        prevPricePerDay: orderInfo.offerPricePerDay,
        prevStartDate: orderInfo.offerStartDate,
        prevEndDate: orderInfo.offerEndDate,
      };
    }

    const cancelStatus = await cancelFunc(id, newData);

    let chatId = orderInfo.chatId;
    createMessageFunc = createMessageFunc;
    let messageData = {};
    let orderPart = {
      id: orderInfo.id,
      cancelStatus,
    };

    if (orderInfo.orderParentId) {
      chatId = orderInfo.parentChatId;
      createMessageFunc = createMessageFuncIfExtension;
      messageData = {
        extensionId: orderInfo.id,
        offerStartDate:
          lastUpdateRequestInfo?.newStartDate ?? orderInfo.offerStartDate,
        offerEndDate:
          lastUpdateRequestInfo?.newEndDate ?? orderInfo.offerEndDate,
        offerPrice:
          lastUpdateRequestInfo?.newPricePerDay ?? orderInfo.offerPricePerDay,
      };

      const parentOrderExtensions = await this.orderModel.getOrderExtends(
        orderInfo.orderParentId
      );

      const conflictOrders = await this.orderModel.getConflictOrders(
        [orderInfo.orderParentId],
        false
      );

      orderPart = {
        id: orderInfo.orderParentId,
        extendOrders: parentOrderExtensions,
        conflictOrders: conflictOrders[orderInfo.orderParentId],
      };
    }

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
      tenantId,
      status,
      cancelStatus,
      offerStartDate,
      offerEndDate,
      tenantFee,
      offerPricePerDay,
    } = orderInfo;

    if (tenantId != userId || orderInfo.disputeStatus) {
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

    if (status != STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) {
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

    let chatId = orderInfo.chatId;
    let createMessageFunc = this.chatMessageModel.createCanceledOrderMessage;
    let messageData = {};
    let orderPart = {
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

    this.sendRefundProcessMail(orderInfo.tenantEmail, orderInfo.id);

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
        userType: "tenant",
        availableStatusesToCancel: [
          STATIC.ORDER_STATUSES.PENDING_OWNER,
          STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
        ],
        cancelFunc: this.orderModel.successCancelled,
        createMessageFunc: this.chatMessageModel.createCanceledOrderMessage,
        createMessageFuncIfExtension:
          this.chatMessageModel.createCanceledExtensionMessage,
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

  finishedByOwner = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const {
        token,
        itemMatchesDescription = null,
        itemMatchesPhotos = null,
        itemFullyFunctional = null,
        partsGoodCondition = null,
        providedGuidelines = null,
      } = req.body;

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

      const checklistImages = await this.getChecklistImages(req);

      await this.checklistModel.createByOwner({
        itemMatchesDescription,
        itemMatchesPhotos,
        itemFullyFunctional,
        partsGoodCondition,
        providedGuidelines,
        orderId: orderInfo.id,
        images: checklistImages,
      });

      const newStatus = await this.orderModel.orderFinished(token);

      const parentOrderExtensions = await this.orderModel.getOrderExtends(
        orderInfo.id
      );

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId: orderInfo.chatId,
        messageData: {},
        senderId: userId,
        createMessageFunc: this.chatMessageModel.createFinishedOrderMessage,
        orderPart: {
          id: orderInfo.id,
          status: newStatus,
          extendOrders: parentOrderExtensions,
        },
      });

      this.sendAssetPickupOffMail(orderInfo.ownerEmail, orderInfo.id);

      await this.orderModel.orderCancelExtends(orderInfo.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        orderPart: { status: newStatus, id: orderInfo.id },
      });
    });

  generateInvoicePdf = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const userId = req.userData.userId;
      const order = await this.orderModel.getFullById(id);

      if (!order || order.tenantId != userId) {
        return res.sendStatus(404);
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
    const canViewFullInfo = order.ownerId === userId;

    const resGetConflictOrders = await this.orderModel.getConflictOrders(
      [order.id],
      canViewFullInfo
    );

    const conflictOrders = resGetConflictOrders[order.id];

    order["extendOrders"] = await this.orderModel.getOrderExtends(
      order.orderParentId ?? order.id
    );

    if (userId != order.tenantId) {
      order["conflictOrders"] = conflictOrders;
      order["ownerAcceptListingQrcode"] = null;
    }

    if (userId != order.ownerId) {
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
