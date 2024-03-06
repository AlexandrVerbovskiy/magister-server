const Controller = require("./Controller");
const STATIC = require("../static");

class UserVerifyRequestController extends Controller {
  constructor() {
    super();
  }

  baseUserVerifyRequestList = async (req) => {
    const timeInfos = await this.listTimeOption(req);

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.userVerifyRequestModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"]
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    const requests = await this.userVerifyRequestModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = this.baseUserVerifyRequestList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getById = (req, res) =>
    this.baseGetById(req, res, this.userVerifyRequestModel);

  createUserVerifyRequest = (req, res) =>
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

  updateUserVerifyRequest = (req, res) =>
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
}

module.exports = new UserVerifyRequestController();
