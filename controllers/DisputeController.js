const STATIC = require("../static");
const Controller = require("./Controller");

class DisputeController extends Controller {
  baseDisputeList = async (req) => {
    const timeInfos = await this.getListTimeAutoOption(
      req,
      STATIC.TIME_FILTER_TYPES.TYPE
    );

    const type = req.body.type ?? "all";
    const filter = req.body.filter ?? "";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.disputeModel.totalCount({ filter, timeInfos, type })
    );

    options["type"] = type;
    options = this.addTimeInfoToOptions(options, timeInfos);

    let disputes = await this.disputeModel.list(options);

    disputes = await this.listingModel.listingsBindImages(
      disputes,
      "listingId"
    );

    disputes = await this.ownerCommentModel.bindAverageForKeyEntities(
      disputes,
      "ownerId",
      {
        commentCountName: "ownerCommentCount",
        averageRatingName: "ownerAverageRating",
      }
    );

    disputes = await this.ownerCommentModel.bindAverageForKeyEntities(
      disputes,
      "tenantId",
      {
        commentCountName: "tenantCommentCount",
        averageRatingName: "tenantAverageRating",
      }
    );

    const typesCount = await this.disputeModel.getTypesCount({
      filter,
      timeInfos,
    });

    return {
      items: disputes,
      options,
      countItems,
      typesCount,
    };
  };

  create = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { orderId, type, description } = req.body;

      const order = await this.orderModel.getFullById(orderId);

      if (
        (order.ownerId != userId && order.tenantId != userId) ||
        order.cancelStatus == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED ||
        [
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
          STATIC.ORDER_STATUSES.FINISHED,
        ].includes(STATIC.ORDER_STATUSES) ||
        order.disputeId
      ) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

      const disputeId = await this.disputeModel.create({
        description,
        type,
        senderId: userId,
        orderId,
      });

      const disputeStatus = STATIC.DISPUTE_STATUSES.OPEN;

      const { chatMessage } = await this.createAndSendMessageForUpdatedOrder({
        chatId: order.chatId,
        messageData: { description, type },
        senderId: userId,
        createMessageFunc: this.chatMessageModel.createStartedDisputeMessage,
        orderPart: {
          id: order.id,
          disputeId,
          disputeStatus,
          disputeType: type,
          disputeDescription: description,
        },
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        disputeId,
        disputeStatus,
        disputeType: type,
        disputeDescription: description,
      });
    });

  solve = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { disputeId, solution } = req.body;
      const disputeStatus = await this.disputeModel.solve(solution, disputeId);
      const chatId = await this.disputeModel.getChatId(disputeId);

      const chatMessage =
        await this.chatMessageModel.createResolvedDisputeMessage({ chatId });

      this.sendSocketMessageToChatUsers(chatId, "get-message", {
        message: chatMessage,
        orderPart: { disputeStatus },
      });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        message: chatMessage,
        orderPart: { disputeStatus },
      });
    });

  unsolve = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { disputeId } = req.body;
      await this.disputeModel.unsolve(disputeId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseDisputeList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = DisputeController;
