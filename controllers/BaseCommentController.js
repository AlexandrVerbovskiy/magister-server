const STATIC = require("../static");
const Controller = require("./Controller");

class BaseCommentController extends Controller {
  needListingImages = false;

  baseCommentList = async (req) => {
    const timeInfos = await this.getListTimeAutoOption(
      req,
      STATIC.TIME_FILTER_TYPES.TYPE
    );

    const type = req.body.type ?? "suspended";
    const filter = req.body.filter ?? "";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.model.totalCount({ filter, timeInfos, type })
    );

    options["type"] = type;
    options = this.addTimeInfoToOptions(options, timeInfos);

    let comments = await this.model.list(options);

    const typesCount = await this.model.getCommentTypesCount({
      timeInfos,
      filter,
    });

    if (this.needListingImages) {
      comments = await this.listingModel.listingsBindImages(
        comments,
        "listingId"
      );
    }

    comments = await this.ratingJoin(comments);

    return {
      items: comments,
      options,
      countItems,
      typesCount,
    };
  };

  commentList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseCommentList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  approve = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      await this.model.approve(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  reject = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, description } = req.body;
      await this.model.reject(id, description);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });
}

module.exports = BaseCommentController;
