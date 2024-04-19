const STATIC = require("../static");
const Controller = require("./Controller");

class OrderUpdateRequestController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { orderId, newStartDate, newEndDate, newPricePerDay } = req.body;
      const senderId = req.userData.userId;

      const order = await this.orderModel.getFullById(orderId);

      if (order.tenantId != senderId && order.ownerId != senderId) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const lastInfo =
        await this.orderUpdateRequestModel.getFullForLastActive();

      if (lastInfo) {
        if (lastInfo.senderId == senderId) {
          return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
        } else {
          await this.orderUpdateRequestModel.closeLast();
        }
      }

      if (order.tenantId == senderId) {
        await this.orderModel.setPendingOwnerStatus(orderId);
      }

      if (order.ownerId == senderId) {
        await this.orderModel.setPendingTenantStatus(orderId);
      }

      const fee = await this.systemOptionModel.getTenantBaseCommissionPercent();

      const createdRequestId = await this.orderUpdateRequestModel.create({
        orderId,
        newStartDate,
        newEndDate,
        newPricePerDay,
        senderId,
        fee,
      });

      const request = await this.orderUpdateRequestModel.getFullById(
        createdRequestId
      );

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        request
      );
    });
}

module.exports = new OrderUpdateRequestController();
