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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
    disputes = await this.tenantCommentModel.bindAverageForKeyEntities(
=======
    disputes = await this.workerCommentModel.bindAverageForKeyEntities(
>>>>>>> e08e27f (total rotation)
      disputes,
      "workerId",
      {
<<<<<<< HEAD
        commentCountName: "tenantCommentCount",
        averageRatingName: "tenantAverageRating",
=======
    disputes = await this.renterCommentModel.bindAverageForKeyEntities(
      disputes,
      "renterId",
      {
        commentCountName: "renterCommentCount",
        averageRatingName: "renterAverageRating",
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
        commentCountName: "workerCommentCount",
        averageRatingName: "workerAverageRating",
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
      const tenantId = +order.tenantId;
=======
      const workerId = +order.workerId;
>>>>>>> e08e27f (total rotation)
      const ownerId = +order.ownerId;

      const isOwnerCreatedDispute = userId == ownerId;
      const isWorkerCreatedDispute = userId == workerId;

      if (
<<<<<<< HEAD
        (!isTenantCreatedDispute && !isOwnerCreatedDispute) ||
=======
      const renterId = +order.renterId;
      const ownerId = +order.ownerId;

      const isOwnerCreatedDispute = userId == ownerId;
      const isRenterCreatedDispute = userId == renterId;

      if (
        (!isRenterCreatedDispute && !isOwnerCreatedDispute) ||
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
        (!isWorkerCreatedDispute && !isOwnerCreatedDispute) ||
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
        order.cancelStatus == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED ||
        ![
          STATIC.ORDER_STATUSES.IN_PROCESS,
          STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
        : order.tenantName;
=======
        : order.renterName;
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
        : order.workerName;
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)

      const createdMessages = await this.chatModel.createForDispute({
        orderId,
        disputeId,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
        userIds: [tenantId, ownerId],
=======
        userIds: [renterId, ownerId],
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
        userIds: [workerId, ownerId],
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
        data: { senderId: userId, senderName, description, type },
      });

      if (isOwnerCreatedDispute) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
        await this.sendSocketMessageToUser(tenantId, "get-message", {
          message: createdMessages[tenantId],
        });
      }

      if (isTenantCreatedDispute) {
=======
        await this.sendSocketMessageToUser(renterId, "get-message", {
          message: createdMessages[renterId],
        });
      }

      if (isRenterCreatedDispute) {
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
        await this.sendSocketMessageToUser(workerId, "get-message", {
          message: createdMessages[workerId],
        });
      }

      if (isWorkerCreatedDispute) {
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
        await this.sendSocketMessageToUser(ownerId, "get-message", {
          message: createdMessages[ownerId],
        });
      }

      const ownerDisputeChatId = createdMessages[ownerId].chatId;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
      const tenantDisputeChatId = createdMessages[tenantId].chatId;
=======
      const renterDisputeChatId = createdMessages[renterId].chatId;
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
      const workerDisputeChatId = createdMessages[workerId].chatId;
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
            ? tenantDisputeChatId
=======
            ? renterDisputeChatId
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
            ? workerDisputeChatId
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
            : ownerDisputeChatId,
        },
      });
      
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd4adb2 (start)
            : tenantDisputeChatId,
          extendOrders: parentOrderExtensions,
=======
            : renterDisputeChatId,
>>>>>>> fad5f76 (start)
<<<<<<< HEAD
=======
            : workerDisputeChatId,
>>>>>>> e08e27f (total rotation)
=======
>>>>>>> bd4adb2 (start)
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
