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

      const isOwnerCreatedDispute = userId == ownerId;
      const isTenantCreatedDispute = userId == tenantId;

      if (
        (!isTenantCreatedDispute && !isOwnerCreatedDispute) ||
        order.cancelStatus == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED ||
        ![
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
          STATIC.ORDER_STATUSES.FINISHED,
        ].includes(order.status) ||
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
      const senderName = isOwnerCreatedDispute
        ? order.ownerName
        : order.tenantName;

      const createdMessages = await this.chatModel.createForDispute({
        orderId,
        disputeId,
        userIds: [tenantId, ownerId],
        data: { senderId: userId, senderName, description, type },
      });

      if (isOwnerCreatedDispute) {
        await this.sendSocketMessageToUser(tenantId, "get-message", {
          message: createdMessages[tenantId],
        });
      }

      if (isTenantCreatedDispute) {
        await this.sendSocketMessageToUser(ownerId, "get-message", {
          message: createdMessages[ownerId],
        });
      }

      const ownerDisputeChatId = createdMessages[ownerId].chatId;
      const tenantDisputeChatId = createdMessages[tenantId].chatId;

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
          disputeChatId: isOwnerCreatedDispute
            ? tenantDisputeChatId
            : ownerDisputeChatId,
        },
      });

      await this.orderModel.orderCancelExtends(order.id);

      const parentOrderExtensions = await this.orderModel.getOrderExtends(
        order.id
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        chatMessage,
        orderPart: {
          id: order.id,
          disputeId,
          disputeStatus,
          disputeType: type,
          disputeDescription: description,
          disputeChatId: isOwnerCreatedDispute
            ? ownerDisputeChatId
            : tenantDisputeChatId,
          extendOrders: parentOrderExtensions,
        },
      });
    });

  solve = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { disputeId, solution } = req.body;
      const disputeStatus = await this.disputeModel.solve(solution, disputeId);
      const { orderId, chatId } =
        await this.disputeModel.getOrderChatIdsByDispute(disputeId);

      const createdMessages = [];

      const chatMessage =
        await this.chatMessageModel.createResolvedDisputeMessage({
          chatId: chatId,
        });

      this.sendSocketMessageToChatUsers(chatId, "get-message", {
        message: chatMessage,
        orderPart: { id: orderId, disputeStatus },
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
          orderPart: { id: orderId, disputeStatus },
        });

        createdMessages.push(chatMessage);
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        messages: createdMessages,
        orderPart: { id: orderId, disputeStatus },
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
