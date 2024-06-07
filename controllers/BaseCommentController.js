const STATIC = require("../static");
const Controller = require("./Controller");

class BaseCommentController extends Controller {
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

    const comments = await this.model.list(options);
    const typesCount = await this.model.getCommentTypesCount({
      timeInfos,
      filter,
    });

    return {
      items: comments,
      options,
      countItems,
      typesCount,
    };
  };

  commentList = async (req, res) => {
    const result = await this.baseCommentList(req);
    const items = result.items;

    const commentsWithImages = await this.listingModel.listingsBindImages(
      items,
      "listingId"
    );

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
      ...result,
      items: commentsWithImages,
    });
  };

  approve = async (req, res) => {
    const { id } = req.body;
    await this.model.approve(id);
    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  reject = async (req, res) => {
    const { id, description } = req.body;
    await this.model.reject(id, description);
    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };
}

module.exports = BaseCommentController;
