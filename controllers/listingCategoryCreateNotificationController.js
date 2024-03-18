const STATIC = require("../static");
const Controller = require("./Controller");

class ListingCategoryCreateNotificationModel extends Controller {
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

  onCreateCategory = async (categoryName) => {
    const notificationInfos =
      await this.listingCategoryCreateNotificationModel.getForCategoryName(
        categoryName
      );

    const toDeleteIds = notificationInfos.map((info) => info.id);
    const toSentMessageEmails = [
      ...new Set(notificationInfos.map((info) => info.userEmail)),
    ];

    toSentMessageEmails.forEach((email) =>
      this.sendCreatedListingCategory(email, categoryName)
    );

    await this.listingCategoryCreateNotificationModel.deleteList(toDeleteIds);
  };
}

module.exports = new ListingCategoryCreateNotificationModel();
