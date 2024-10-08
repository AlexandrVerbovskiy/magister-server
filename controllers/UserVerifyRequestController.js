const Controller = require("./Controller");
const STATIC = require("../static");

class UserVerifyRequestController extends Controller {
  baseUserVerifyRequestList = async (req) => {
    const timeInfos = await this.getListTimeAutoOption(
      req,
      STATIC.TIME_FILTER_TYPES.TYPE
    );

    const status = req.body.status ?? "suspended";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.userVerifyRequestModel.totalCount(filter, timeInfos, status)
    );

    options = this.addTimeInfoToOptions(options, timeInfos);
    options["status"] = status;

    const requests = await this.userVerifyRequestModel.list(options);

    const requestUserIds = requests.map((request) => request.userId);

    const documents = await this.userModel.getDocumentsByUserIds(
      requestUserIds
    );

    requests.forEach(
      (request, index) =>
        (requests[index]["documents"] = documents[request.userId])
    );

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseUserVerifyRequestList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getById = (req, res) =>
    this.baseGetById(req, res, this.userVerifyRequestModel);

  updateUserVerifyRequest = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, verified } = req.body;

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

module.exports = UserVerifyRequestController;
