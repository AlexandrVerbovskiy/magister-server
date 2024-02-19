const BaseController = require("./baseController");
const STATIC = require("../static");
const { timeConverter, getYesterdayDate, getTodayDate } = require("../utils");

class UserVerifyRequestController extends BaseController {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      req.body.fromTime =
        req.body.fromTime ?? timeConverter(getYesterdayDate());
      req.body.toTime = req.body.toTime ?? timeConverter(getTodayDate());

      const { options, countItems } = await this.baseListOptions(
        req,
        ({ filter, fromTime, toTime }) =>
          this.userVerifyRequestModel.totalCount(filter, fromTime, toTime)
      );

      options["fromTime"] = req.body.fromTime;
      options["toTime"] = req.body.toTime;

      const requests = await this.userVerifyRequestModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: requests,
        options,
        countItems,
      });
    });
  };

  getById = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;

      if (isNaN(id)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const request = await this.userVerifyRequestModel.getById(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, request);
    });
  };

  createUserVerifyRequest = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const has =
        await this.userVerifyRequestModel.checkUserHasUnansweredRequest(userId);

      if (has) {
        throw new Error(
          "Have an unanswered request, wait for an administrator to review it before resubmitting"
        );
      }

      await this.userVerifyRequestModel.create(userId);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
  };

  checkUserCanVerifyRequest = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const has =
        await this.userVerifyRequestModel.checkUserHasUnansweredRequest(userId);

      const lastAnswer =
        await this.userVerifyRequestModel.getLastUserAnsweredRequest(userId);

      const lastAnswerDescription = lastAnswer
        ? lastAnswer.failedDescription
        : null;

      this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        canSend: !has,
        lastAnswerDescription,
      });
    });
  };

  updateUserVerifyRequest = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const { id, verified } = req.body;

      if (isNaN(id)) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const description = req.body.description ?? "";
      const userId = await this.userVerifyRequestModel.getUserIdById(id);

      if (!userId) {
        throw new Error("Request wasn't found");
      }

      await this.userModel.setVerified(userId, verified);
      await this.userVerifyRequestModel.updateUserVerifyById(id, description);

      this.saveUserAction(
        req,
        verified
          ? `Accepted user with ${id} verified request`
          : `Rejected user with ${id} verify request`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
  };
}

module.exports = new UserVerifyRequestController();
