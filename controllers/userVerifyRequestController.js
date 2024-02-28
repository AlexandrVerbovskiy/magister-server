const BaseController = require("./baseController");
const STATIC = require("../static");

class UserVerifyRequestController extends BaseController {
  constructor() {
    super();
  }

  list = (req, res) => {
    this.baseWrapper(req, res, async () => {
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, ({ filter }) =>
        this.userVerifyRequestModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
      );

      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const requests = await this.userVerifyRequestModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        items: requests,
        options,
        countItems,
      });
    });
  };

  getById = (req, res) =>
    this.baseGetById(req, res, this.userVerifyRequestModel);

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
          ? `Accepted user with '${id}' verified request`
          : `Rejected user with '${id}' verify request`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
  };
}

module.exports = new UserVerifyRequestController();
