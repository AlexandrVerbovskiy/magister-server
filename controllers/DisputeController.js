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

      const tenantId = +order.tenantId;
      const ownerId = +order.ownerId;

      if (
        (ownerId != userId && tenantId != userId) ||
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

      const senderName = userId == ownerId ? order.ownerId : order.tenantId;

      const createdMessages = await this.chatModel.createForDispute({
        orderId,
        disputeId,
        userIds: [tenantId, ownerId],
        data: { senderId: userId, senderName, description, type },
      });

      if (userId == ownerId) {
        await this.sendSocketMessageToUser(tenantId, "get-message", {
          message: createdMessages[tenantId],
        });
      }

      if (userId == tenantId) {
        await this.sendSocketMessageToUser(ownerId, "get-message", {
          message: createdMessages[ownerId],
        });
      }

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
      const orderChatId = await this.disputeModel.getOrderChatId(disputeId);

      const createdMessages = [];

      const chatMessage =
        await this.chatMessageModel.createResolvedDisputeMessage({
          chatId: orderChatId,
        });

      this.sendSocketMessageToChatUsers(orderChatId, "get-message", {
        message: chatMessage,
        orderPart: { disputeStatus },
      });

      createdMessages.push(chatMessage);

      const disputeChats = await this.disputeModel.getDisputeChatIds(disputeId);

      for (let i = 0; i < disputeChats.length; i++) {
        const disputeChatId = disputeChats[i];

        const chatMessage =
          await this.chatMessageModel.createResolvedDisputeMessage({
            chatId: disputeChatId,
          });

        this.sendSocketMessageToChatUsers(disputeChatId, "get-message", {
          message: chatMessage,
          orderPart: { disputeStatus },
        });

        createdMessages.push(chatMessage);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        messages: createdMessages,
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
