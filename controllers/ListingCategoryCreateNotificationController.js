const STATIC = require("../static");
const Controller = require("./Controller");

class ListingCategoryCreateNotificationController extends Controller {
  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { categoryName } = req.body;
      const { userId } = req.userData;

      const id = await this.listingCategoryCreateNotificationModel.create(
        userId,
        categoryName
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, { id });
    });
}

module.exports = ListingCategoryCreateNotificationController;
