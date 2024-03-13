const STATIC = require("../static");
const Controller = require("./Controller");

class ListingController extends Controller {
  checkUserCanGetNotificationOnCreateCategory = async (
    categories,
    optionCategories,
    userId = null
  ) => {
    let canSendCreateNotifyRequest = false;

    if (optionCategories.length == 1) {
      canSendCreateNotifyRequest = true;
      const searchedCategoryName = optionCategories[0];

      ["firstLevel", "secondLevel", "thirdLevel"].forEach((level) => {
        categories[level].forEach((category) => {
          if (category.name == searchedCategoryName) {
            canSendCreateNotifyRequest = false;
          }
        });
      });

      if (canSendCreateNotifyRequest && userId) {
        const resCheck =
          await this.listingCategoryCreateNotificationModel.checkNameHasCategoryNotify(
            userId,
            searchedCategoryName
          );

        if (resCheck) {
          canSendCreateNotifyRequest = false;
        }
      }
    }

    return canSendCreateNotifyRequest;
  };

  baseListingList = async (req, userId = null) => {
    const cities = req.body.cities ?? [];
    const categories = req.body.categories ?? [];
    const timeInfos = await this.listTimeOption(req, 0, 2);
    const { userId: sessionUserId = null } = req.userData;

    const { options, countItems } = await this.baseList(req, () =>
      this.listingModel.totalCount({
        serverFromTime: timeInfos["serverFromTime"],
        serverToTime: timeInfos["serverToTime"],
        cities,
        categories,
        userId,
      })
    );

    options["userId"] = userId;
    options["cities"] = cities;
    options["categories"] = categories;

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    const listings = await this.listingModel.list(options);
    const listingsWithImages = await this.listingModel.listingsByImages(
      listings
    );

    const dbCategories = await this.listingCategoriesModel.listGroupedByLevel();
    const canSendCreateNotifyRequest =
      await this.checkUserCanGetNotificationOnCreateCategory(
        dbCategories,
        options["categories"],
        sessionUserId
      );

    if (options["categories"].length == 1 && countItems == 0) {
      this.searchedWordModel.updateSearchCount(options["categories"][0]);
    }

    return {
      items: listingsWithImages,
      options,
      countItems,
      canSendCreateNotifyRequest,
      categories: dbCategories,
    };
  };

  baseListingWithStatusesList = async (req, userId = null) => {
    const status = req.body.status ?? "all";

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.listingModel.totalCountWithLastRequests(filter, userId, status)
    );

    options["userId"] = userId;
    options["status"] = status;
    const listings = await this.listingModel.listWithLastRequests(options);

    const listingsWithImages = await this.listingModel.listingsByImages(
      listings
    );

    return {
      items: listingsWithImages,
      options,
      countItems,
    };
  };

  mainList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseListingList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseListingWithStatusesList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getCurrentUserList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await this.baseListingWithStatusesList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getShortById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const listing = await this.listingModel.getById(id);

      if (!listing) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing wasn't found"
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, listing);
    });

  getFullById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      const listing = await this.listingModel.getFullById(id);

      if (!listing) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing wasn't found"
        );
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, listing);
    });

  localGetFiles = (req) => {
    const listingImages = JSON.parse(req.body["listingImages"] ?? "[]");

    const filesToSave = [];

    req.files.forEach((file) => {
      const filePath = this.moveUploadsFileToFolder(file, "listings");
      filesToSave.push({ type: "storage", link: filePath });
    });

    return [...filesToSave, ...listingImages];
  };

  baseCreate = async (req, res) => {
    const dataToSave = req.body;
    dataToSave["listingImages"] = this.localGetFiles(req);

    const listingId = await this.listingModel.create(dataToSave);

    const listingImagesToRes = dataToSave["listingImages"].map((info) => ({
      type: info.type,
      link: info.link,
      listingId,
    }));

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Created successfully",
      {
        ...dataToSave,
        id: listingId,
        listingId,
        listingImages: listingImagesToRes,
      }
    );
  };

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      req.body.ownerId = userId;

      const result = await this.baseCreate(req, res);

      this.saveUserAction(
        req,
        `User create a listing with name '${req.body.name}'`
      );

      return result;
    });

  checkForbidden = async (req) => {
    const { id } = req.body;
    const { userId } = req.userData;

    const hasAccess = await this.listingModel.hasAccess(id, userId);

    if (!hasAccess) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }
  };

  removeListingImages = (deletedImagesInfos) => {
    const toRemovePaths = deletedImagesInfos
      .filter((info) => info.type == "storage")
      .map((info) => info.link);

    toRemovePaths.forEach((path) => this.removeFile(path));
  };

  baseUpdate = async (req, res, canApprove = false) => {
    const dataToSave = req.body;
    dataToSave["listingImages"] = this.localGetFiles(req);

    const listingId = dataToSave["listingId"];

    const { deletedImagesInfos } = await this.listingModel.updateById(
      dataToSave
    );

    this.removeListingImages(deletedImagesInfos);

    const listingImagesToRes = dataToSave["listingImages"].map((info) => ({
      type: info.type,
      link: info.link,
      listingId,
    }));

    if (canApprove && dataToSave["approved"] === "true") {
      await this.listingApprovalRequestModel.approve(listingId);
    }

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Updated successfully",
      { ...dataToSave, listingId, listingImagesToRes }
    );
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await this.checkForbidden(req);
      if (forbidden) return forbidden;

      const { userId } = req.userData;
      req.body["ownerId"] = userId;
      const result = await this.baseUpdate(req, res);

      this.saveUserAction(
        req,
        `User create a listing with name '${req.body.name}'`
      );

      return result;
    });

  changeApprove = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const id = req.body.id;
      const approved = await this.listingModel.changeApprove(id);
      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Updated successfully",
        { id, approved }
      );
    });

  updateByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      req.body["listingId"] = req.body["id"];

      const result = await this.baseUpdate(req, res, true);

      this.saveUserAction(
        req,
        `Admin update a listing with name '${req.body.name}'`
      );

      return result;
    });

  createByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseCreate(req, res);

      this.saveUserAction(
        req,
        `Admin create a listing with name '${req.body.name}'`
      );

      return result;
    });

  baseDelete = async (req, res) => {
    const { id } = req.body;
    await this.listingApprovalRequestModel.deleteByListing(id);
    const { deletedImagesInfos } = await this.listingModel.deleteById(id);
    this.removeListingImages(deletedImagesInfos);

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await this.checkForbidden(req);
      if (forbidden) return forbidden;

      const { id } = req.body;
      const listing = await this.listingModel.getById(id);

      const result = await this.baseDelete(req, res);

      this.saveUserAction(
        req,
        `User delete a listing with name '${listing.name}'`
      );

      return result;
    });

  deleteByAdmin = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const listing = await this.listingModel.getById(id);

      const result = await this.baseDelete(req, res);

      this.saveUserAction(
        req,
        `Admin delete a listing with name '${listing.name}'`
      );

      return result;
    });
}

module.exports = new ListingController();
