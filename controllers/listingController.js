const STATIC = require("../static");
const Controller = require("./Controller");

class ListingController extends Controller {
  defaultItemsPerPage = 6;

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
          await this.listingCategoryCreateNotificationModel.checkUserHasCategoryNotify(
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

  baseCountListings = async (req, userId = null) => {
    const cities = req.body.cities ?? [];
    const categories = req.body.categories ?? [];
    const distance = req.body.distance ?? null;
    const minPrice = req.body.minPrice ?? null;
    const maxPrice = req.body.maxPrice ?? null;
    const lat = req.body.lat ?? null;
    const lng = req.body.lng ?? null;

    const timeInfos = await this.listTimeOption({
      req,
      type: STATIC.TIME_OPTIONS_TYPE_DEFAULT.TODAY,
    });
    const searchCity = req.body.searchCity ?? null;
    const searchCategory = req.body.searchCategory ?? null;

    let { options, countItems } = await this.baseList(req, () =>
      this.listingModel.totalCount({
        timeInfos,
        cities: [...cities],
        categories: [...categories],
        userId,
        searchCity,
        searchCategory,
        distance,
        minPrice,
        maxPrice,
        lat,
        lng,
      })
    );

    options["searchCity"] = searchCity;
    options["searchCategory"] = searchCategory;

    options = this.addTimeInfoToOptions(options, timeInfos);

    return {
      options,
      countItems,
      timeInfos,
      cities,
      categories,
      distance,
      minPrice,
      maxPrice,
    };
  };

  baseListingList = async (req, userId = null) => {
    let {
      options,
      countItems,
      timeInfos,
      cities,
      categories,
      distance,
      minPrice,
      maxPrice,
    } = await this.baseCountListings(req, userId);

    const sessionUserId = req.userData.userId;

    options["userId"] = userId;
    options["cities"] = cities;
    options["categories"] = categories;
    options["distance"] = distance;
    options["minPrice"] = minPrice;
    options["maxPrice"] = maxPrice;

    options["searchCity"] = req.body.searchCity ?? null;
    options["searchCategory"] = req.body.searchCategory ?? null;

    options = this.addTimeInfoToOptions(options, timeInfos);
    options["lat"] = req.body.lat;
    options["lng"] = req.body.lng;

    const listings = await this.listingModel.list(options);

    const listingsWithImages = await this.listingModel.listingsBindImages(
      listings
    );

    const dbCategories = await this.listingCategoryModel.listGroupedByLevel();

    const categoriesToCheckHasNotify = options["searchCategory"]
      ? [options["searchCategory"], ...options["categories"]]
      : [...options["categories"]];

    const canSendCreateNotifyRequest =
      await this.checkUserCanGetNotificationOnCreateCategory(
        dbCategories,
        categoriesToCheckHasNotify,
        sessionUserId
      );

    if (categoriesToCheckHasNotify.length == 1 && countItems == 0) {
      this.searchedWordModel.updateSearchCount(categoriesToCheckHasNotify[0]);
    }

    const ratingListingsWithImages =
      await this.listingCommentModel.bindAverageForKeyEntities(
        listingsWithImages,
        "id"
      );

    const ratingListingsWithImagesFavorites =
      await this.userListingFavoriteModel.bindUserListingListFavorite(
        ratingListingsWithImages,
        sessionUserId
      );

    return {
      items: ratingListingsWithImagesFavorites,
      options,
      countItems,
      canSendCreateNotifyRequest,
    };
  };

  baseListingWithStatusesList = async (req, userId = null) => {
    const active = req.body.active ?? "all";
    const approved = req.body.approved ?? "all";
    const status = req.body.status ?? "all";

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.listingModel.totalCountWithLastRequests(filter, userId, {
          active,
          approved,
          status,
        })
    );

    options["userId"] = userId;
    options["active"] = active;
    options["approved"] = approved;
    options["status"] = status;

    const listings = await this.listingModel.listWithLastRequests(options);

    const listingsWithImages = await this.listingModel.listingsBindImages(
      listings
    );

    const ratingListingsWithImages =
      await this.listingCommentModel.bindAverageForKeyEntities(
        listingsWithImages,
        "id"
      );

    const ratingListingsOwnersWithImages =
      await this.ownerCommentModel.bindAverageForKeyEntities(
        ratingListingsWithImages,
        "ownerId",
        {
          commentCountName: "ownerCommentCount",
          averageRatingName: "ownerAverageRating",
        }
      );

    return {
      items: ratingListingsOwnersWithImages,
      options,
      countItems,
    };
  };

  mainList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseListingList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  ownerList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const ownerId = req.body.ownerId;
      const result = await this.baseListingList(req, ownerId);
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
      const { fieldname } = file;
      let id = null;

      if (fieldname.includes("[id]")) {
        const regex = /\[(\d+)\]/;
        const match = regex.exec(fieldname);

        if (match !== null) {
          id = parseInt(match[1]);
        }
      }

      const filePath = this.moveUploadsFileToFolder(file, "listings");
      filesToSave.push({ type: "storage", link: filePath, id });
    });

    return [...filesToSave, ...listingImages];
  };

  baseCreate = async (req, res) => {
    const dataToSave = req.body;
    dataToSave["listingImages"] = this.localGetFiles(req);

    dataToSave["defects"] = dataToSave["defects"]
      ? JSON.parse(dataToSave["defects"])
      : [];

    const { defects, listingId, listingImages } =
      await this.listingModel.create(dataToSave);

    dataToSave["userVerified"] = true;

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Created successfully",
      {
        ...dataToSave,
        id: listingId,
        listingId,
        listingImages,
        defects,
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
    dataToSave["defects"] = dataToSave["defects"]
      ? JSON.parse(dataToSave["defects"])
      : [];

    const listingId = dataToSave["id"];
    dataToSave["active"] = dataToSave["active"] == "true";

    const {
      defects,
      deletedImagesInfos,
      listingImages: listingImagesToRes,
    } = await this.listingModel.updateById(dataToSave);

    this.removeListingImages(deletedImagesInfos);

    if (canApprove && dataToSave["approved"] === "true") {
      await this.listingApprovalRequestModel.approve(listingId);
    }

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Updated successfully",
      { ...dataToSave, listingId, listingImagesToRes, defects }
    );
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await this.checkForbidden(req);
      if (forbidden) return forbidden;

      const { userId } = req.userData;
      req.body["ownerId"] = userId;
      req.body["approved"] = false;

      const listingId = req.body.id;
      const countUnfinishedListingOrders =
        await this.orderModel.getUnfinishedListingCount(listingId);

      if (countUnfinishedListingOrders) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.DATA_CONFLICT,
          "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
        );
      }

      const listing = await this.listingModel.getById(listingId);

      if (listing.approved) {
        const hasNotViewedByAdminRequest =
          await this.listingApprovalRequestModel.hasNotViewedByAdminRequest(
            listingId
          );

        if (hasNotViewedByAdminRequest) {
          return this.sendErrorResponse(
            res,
            STATIC.ERRORS.BAD_REQUEST,
            "The request was sent earlier. Wait for the administrator's response"
          );
        }

        await this.listingApprovalRequestModel.create(listingId);
      }

      const result = await this.baseUpdate(req, res);

      this.saveUserAction(
        req,
        `User update a listing with name '${req.body.name}'`
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

    const countUnfinishedListingOrders =
      await this.orderModel.getUnfinishedListingCount(id);

    if (countUnfinishedListingOrders) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "The listing has a unfinished booking or order. Please finish all listing orders and bookings before deleting"
      );
    }

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

  baseChangeActive = async (req, res, changeActiveCall) => {
    const { id } = req.body;

    const countUnfinishedListingOrders =
      await this.orderModel.getUnfinishedListingCount(id);

    if (countUnfinishedListingOrders) {
      return this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
      );
    }

    const active = await changeActiveCall(id);

    const message = active
      ? "Listing activated successfully"
      : "Listing deactivated successfully";

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
      id,
      active,
    });
  };

  changeActive = (req, res) =>
    this.baseWrapper(req, res, () => {
      const userId = req.userData.userId;
      return this.baseChangeActive(req, res, (listingId) =>
        this.listingModel.changeActiveByUser(listingId, userId)
      );
    });

  changeActiveByAdmin = (req, res) =>
    this.baseWrapper(req, res, () => {
      return this.baseChangeActive(req, res, (listingId) =>
        this.listingModel.changeActive(listingId)
      );
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

  changeFavorite = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { listingId } = req.body;
      const { userId } = req.userData;

      const isFavorite = await this.userListingFavoriteModel.changeUserFavorite(
        userId,
        listingId
      );

      console.log(isFavorite);

      const message = isFavorite ? "Favorite mark added" : "Favorite removed";

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        isFavorite,
      });
    });
}

module.exports = new ListingController();
