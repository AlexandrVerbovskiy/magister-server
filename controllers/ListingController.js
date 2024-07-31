const STATIC = require("../static");
const Controller = require("./Controller");
const fs = require("fs");

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
    const othersCategories = req.body.othersCategories == true;
    const sessionUserId = req.userData?.userId;
    const favorites = sessionUserId ? !!req.body.favorites : false;

    const searchCity = req.body.searchCity ?? null;
    const searchCategory = req.body.searchCategory ?? null;
    const searchListing = req.body.searchListing ?? null;

    let { options, countItems } = await this.baseList(req, () =>
      this.listingModel.totalCount({
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
        othersCategories,
        searchListing,
        favorites,
        searcherId: sessionUserId,
      })
    );

    options["searchCity"] = searchCity;
    options["searchCategory"] = searchCategory;
    options["searchListing"] = searchListing;

    return {
      options,
      countItems,
      cities,
      categories,
      distance,
      minPrice,
      maxPrice,
      othersCategories,
    };
  };

  baseListingList = async (req, userId = null) => {
    let {
      options,
      countItems,
      cities,
      categories,
      distance,
      minPrice,
      maxPrice,
      othersCategories,
    } = await this.baseCountListings(req, userId);

    const sessionUserId = req.userData?.userId;

    options["userId"] = userId;
    options["cities"] = cities;
    options["categories"] = categories;
    options["distance"] = distance;
    options["minPrice"] = minPrice;
    options["maxPrice"] = maxPrice;
    options["othersCategories"] = othersCategories;

    options["searchCity"] = req.body.searchCity ?? null;
    options["searchCategory"] = req.body.searchCategory ?? null;
    options["searchListing"] = req.body.searchListing ?? null;
    options["favorites"] = sessionUserId ? !!req.body.favorites : false;

    options["lat"] = req.body.lat;
    options["lng"] = req.body.lng;

    let listings = await this.listingModel.list({
      ...options,
      searcherId: sessionUserId,
    });

    listings = await this.listingModel.listingsBindImages(listings);

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

    listings = await this.listingCommentModel.bindAverageForKeyEntities(
      listings,
      "id"
    );

    if (sessionUserId) {
      listings =
        await this.userListingFavoriteModel.bindUserListingListFavorite(
          listings,
          sessionUserId
        );
    }

    return {
      items: listings,
      options,
      countItems,
      canSendCreateNotifyRequest,
    };
  };

  wrapListingList = async (listings) => {
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

    return ratingListingsOwnersWithImages;
  };

  baseListingWithApprovedWaitedStatusesList = async (req, userId = null) => {
    const active = req.body.active ?? "all";
    const approved = req.body.approved ?? "all";

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.listingModel.totalCountWithLastRequestsByApprovedWaited(
          filter,
          userId,
          {
            active,
            approved,
          }
        )
    );

    options["userId"] = userId;
    options["active"] = active;
    options["approved"] = approved;

    const listings =
      await this.listingModel.listWithLastRequestsByApprovedWaited(options);
    const wrappedListings = await this.wrapListingList(listings);

    return {
      items: wrappedListings,
      options,
      countItems,
    };
  };

  baseListingWithStatusesList = async (req, userId = null) => {
    const status = req.body.status ?? "all";

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.listingModel.totalCountWithLastRequestsByStatus(filter, userId, {
          status,
        })
    );

    options["userId"] = userId;
    options["status"] = status;

    const listings = await this.listingModel.listWithLastRequestsByStatus(
      options
    );
    const wrappedListings = await this.wrapListingList(listings);

    return {
      items: wrappedListings,
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
      const result = await this.baseListingWithApprovedWaitedStatusesList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getCurrentUserList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await this.baseListingWithStatusesList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
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

      if (fs.existsSync(file.path)) {
        const filePath = this.moveUploadsFileToFolder(file, "listings");
        filesToSave.push({ type: "storage", link: filePath, id });
      }
    });

    return [...filesToSave, ...listingImages];
  };

  checkValidCategoryId = async (categoryId) => {
    const category = await this.listingCategoryModel.getById(categoryId);
    return !!category;
  };

  baseCreate = async (req, res, needSendRequest = false) => {
    const dataToSave = req.body;

    if (dataToSave["otherCategory"]) {
      dataToSave["categoryId"] = null;
    } else {
      const resCheckCategoryValid = await this.checkValidCategoryId(
        dataToSave["categoryId"]
      );

      if (!resCheckCategoryValid) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "The selected category was not found"
        );
      }
    }

    const backgroundPhoto = req.files.find(
      (file) => file.fieldname === "backgroundPhoto"
    );

    if (!backgroundPhoto) {
      return this.sendErrorResponse(res, STATIC.ERRORS.BAD_REQUEST);
    }

    dataToSave["backgroundPhoto"] = this.moveUploadsFileToFolder(
      backgroundPhoto,
      "listings"
    );

    dataToSave["listingImages"] = this.localGetFiles(req);

    const { listingId, listingImages } = await this.listingModel.create(
      dataToSave
    );

    dataToSave["userVerified"] = true;

    let createdVerifiedRequest = false;

    if (needSendRequest) {
      await this.listingApprovalRequestModel.create(listingId);
      createdVerifiedRequest = true;
      const owner = await this.userModel.getById(dataToSave.ownerId);
      this.sendAssetListingConfirmation(owner.email, listingId);
    }

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Created successfully",
      {
        listing: {
          ...dataToSave,
          id: listingId,
          listingId,
          listingImages,
        },
        createdVerifiedRequest,
      }
    );
  };

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      req.body.ownerId = userId;

      const result = await this.baseCreate(req, res, true);

      this.saveUserAction(
        req,
        `User create a listing with name '${req.body.name}'`
      );

      return result;
    });

  checkForbidden = async (req, res, field = "id") => {
    const id = req.body[field];
    const { userId } = req.userData;

    const hasAccess = await this.listingModel.hasAccess(id, userId);

    if (!hasAccess) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }
  };

  baseUpdate = async (
    req,
    res,
    canApprove = false,
    needSendRequest = false
  ) => {
    const dataToSave = req.body;
    const listingId = dataToSave["id"];

    if (dataToSave["otherCategory"]) {
      dataToSave["categoryId"] = null;
    } else {
      const resCheckCategoryValid = await this.checkValidCategoryId(
        dataToSave["categoryId"]
      );

      if (!resCheckCategoryValid) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.FORBIDDEN,
          "The selected category was not found"
        );
      }
    }

    const backgroundPhoto = req.files.find(
      (file) => file.fieldname === "backgroundPhoto"
    );

    let backgroundImageToDelete = null;

    const currentBackgroundImage = await this.listingModel.getBackgroundPhoto(
      listingId
    );

    if (backgroundPhoto) {
      dataToSave["backgroundPhoto"] = this.moveUploadsFileToFolder(
        backgroundPhoto,
        "listings"
      );

      backgroundImageToDelete = currentBackgroundImage;
    } else {
      dataToSave["backgroundPhoto"] = currentBackgroundImage;
    }

    dataToSave["listingImages"] = this.localGetFiles(req);

    dataToSave["active"] = dataToSave["active"] == "true";

    const { listingImages: listingImagesToRes } =
      await this.listingModel.updateById(dataToSave);

    if (canApprove && dataToSave["approved"] === "true") {
      await this.listingApprovalRequestModel.approve(listingId);
    }

    let createdVerifiedRequest = false;

    if (needSendRequest) {
      const hasNotViewedByAdminRequest =
        await this.listingApprovalRequestModel.hasNotViewedByAdminRequest(
          listingId
        );

      if (!hasNotViewedByAdminRequest) {
        await this.listingApprovalRequestModel.create(listingId);
      }

      createdVerifiedRequest = true;

      const owner = await this.userModel.getById(dataToSave.ownerId);
      this.sendAssetListingConfirmation(owner.email, listingId);
    }

    if (backgroundImageToDelete) {
      this.removeFile(backgroundImageToDelete);
    }

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Updated successfully",
      {
        listing: {
          ...dataToSave,
          listingId,
          listingImages: listingImagesToRes,
        },
        createdVerifiedRequest,
      }
    );
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await this.checkForbidden(req, res);

      if (forbidden) {
        return forbidden;
      }

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

      const result = await this.baseUpdate(req, res, false, true);

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
    await this.listingModel.deleteById(id);

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

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

    if (active === null) {
      return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
    }

    const message = active
      ? "Listing activated successfully"
      : "Listing deactivated successfully";

    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
      id,
      active,
    });
  };

  changeActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const forbidden = await this.checkForbidden(req, res);

      if (forbidden) {
        return forbidden;
      }

      return await this.baseChangeActive(req, res, (listingId) =>
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
      const listing = await this.listingModel.getById(listingId);

      if (!listing) {
        return this.sendErrorResponse(res, STATIC.ERRORS.NOT_FOUND);
      }

      const isFavorite = await this.userListingFavoriteModel.changeUserFavorite(
        userId,
        listingId
      );

      const message = isFavorite ? "Favorite mark added" : "Favorite removed";

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, message, {
        isFavorite,
      });
    });
}

module.exports = ListingController;
