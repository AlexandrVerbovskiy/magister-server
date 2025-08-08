const STATIC = require("../static");
const {
  startCheckingModel,
  checkModelQuery,
  startTrainingModel,
  startRevaluationOrders,
} = require("../services/forestServerRequests");
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
      await this.disputePredictionModel.setActive(
        req.body.id,
        req.body.rebuild ?? false
      );

      if (req.body.rebuild) {
        await startRevaluationOrders();
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  getDetails = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const model = await this.disputePredictionModel.getDetailsById(
        req.params.id
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { model });
    });

  startTraining = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const modelId = req.body.id;
      const selectedFields = req.body.selectedFields || [];

      await this.disputePredictionModel.setStartTrainingStatus(
        modelId,
        selectedFields
      );
      await startTrainingModel(modelId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  create = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        body,
        checkField,
        afterFinishActive = false,
        afterFinishRebuild = false,
      } = req.body;

      try {
        const errorMessage = await checkModelQuery(body);

        if (errorMessage) {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.BAD_REQUEST,
            errorMessage
          );
        }
      } catch (e) {
        console.log("forest server error: ", e.message);
      }

      const createdId = await this.disputePredictionModel.create({
        body,
        checkField,
        afterFinishActive,
        afterFinishRebuild,
      });

      try {
        await startCheckingModel(createdId);
      } catch (e) {
        console.log("forest server error: ", e.message);
      }

      const data = await this.disputePredictionModel.getDetailsById(createdId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, data);
    });

  update = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const {
        id,
        body,
        checkField,
        afterFinishActive = false,
        afterFinishRebuild = false,
      } = req.body;
      try {
        const errorMessage = await checkModelQuery(body);

        if (errorMessage) {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.BAD_REQUEST,
            errorMessage
          );
        }
      } catch (e) {
        console.log("forest server error: ", e.message);
      }

      if (errorMessage) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          errorMessage
        );
      }

      await this.disputePredictionModel.update(id, {
        body,
        afterFinishActive,
        afterFinishRebuild,
        checkField,
      });

      const data = await this.disputePredictionModel.getDetailsById(id);

      try {
        await startCheckingModel(id);
      } catch (e) {
        console.log("forest server error: ", e.message);
      }

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
      const result = await this.baseDisputePredictionModelList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });
}

module.exports = DisputePredictionModelController;
