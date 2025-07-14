const STATIC = require("../static");
const Controller = require("./Controller");

class DisputePredictionModelController extends Controller {
  stop = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      await this.disputePredictionModel.stop(req.body.id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  unstop = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      await this.disputePredictionModel.unstop(req.body.id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  setActive = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      await this.disputePredictionModel.setActive(req.body.id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  create = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        body,
        afterFinishActive = false,
        afterFinishRebuild = false,
      } = req.body;
      const createdId = await this.disputePredictionModel.create({
        body,
        afterFinishActive,
        afterFinishRebuild,
      });

      const data = await this.disputePredictionModel.getDetailsById(createdId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, data);
    });

  update = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        id,
        body,
        afterFinishActive = false,
        afterFinishRebuild = false,
      } = req.body;
      await this.disputePredictionModel.update(id, {
        body,
        afterFinishActive,
        afterFinishRebuild,
      });

      const data = await this.disputePredictionModel.getDetailsById(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, data);
    });

  baseDisputePredictionModelList = async (req) => {
    const { options, countItems } = await this.baseList(
      req,
      this.disputePredictionModel.totalCount
    );

    const requests = await this.disputePredictionModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseLogList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = DisputePredictionModelController;
