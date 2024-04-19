const STATIC = require("../static");
const { generateDatesBetween } = require("../utils");
const Controller = require("./Controller");

class OrderController extends Controller {
  constructor() {
    super();
  }

  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      const order = await this.orderModel.getFullById(id);

      if (!order) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, order);
    });

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { pricePerDay, startDate, endDate, listingId } = req.body;
      const tenantId = req.userData.userId;

      const fee = await this.systemOptionModel.getTenantBaseCommissionPercent();

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
        fee,
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
    const timeInfos = await this.listTimeOption(req, 30, 30);

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
      const { orderId } = req.body;
      const userId = req.userData.userId;

      const order = await this.orderModel.getById(orderId);

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
        await this.orderUpdateRequestModel.getFullForLastActive(orderId);

      if (lastUpdateRequestInfo.senderId == userId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      if (lastUpdateRequestInfo) {
        await this.orderModel.acceptUpdateRequest({
          orderId,
          newStartDate: lastUpdateRequestInfo.newStartDate,
          newEndDate: lastUpdateRequestInfo.newEndDate,
          newPricePerDay: lastUpdateRequestInfo.newPricePerDay,
        });
      } else {
        await this.orderModel.acceptOrder(orderId);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  rejectBooking = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId } = req.body;
      const userId = req.userData.userId;

      const order = await this.orderModel.getById(orderId);

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

      if (order.tenantId == userId) {
        await this.orderModel.successCanceled(orderId);
      } else {
        await this.orderModel.rejectOrder(orderId);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = new OrderController();
