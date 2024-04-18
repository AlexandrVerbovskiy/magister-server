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
    const timeInfos = await this.listTimeOption(req);

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

    const requests = listCall(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  tenantList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const tenantId = req.userData.userId;

      const totalCountCall = (filter, serverFromTime, serverToTime) =>
        this.orderModel.tenantTotalCount(
          filter,
          serverFromTime,
          serverToTime,
          tenantId
        );

      const listCall = (options) => {
        options["tenantId"] = tenantId;
        return this.orderModel.tenantList(options);
      };

      const result = await this.baseRequestsList(req, totalCountCall, listCall);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  ownerList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const ownerId = req.userData.userId;

      const totalCountCall = (filter, serverFromTime, serverToTime) =>
        this.orderModel.ownerTotalCount(
          filter,
          serverFromTime,
          serverToTime,
          ownerId
        );

      const listCall = (options) => {
        options["ownerId"] = ownerId;
        return this.orderModel.ownerList(options);
      };

      const result = await this.baseRequestsList(req, totalCountCall, listCall);
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
}

module.exports = new OrderController();
