const STATIC = require("../static");
const Controller = require("./Controller");

class ListingController extends Controller {
  baseListingList = async (req, userId = null) => {
    const cities = req.body.cities ?? [];
    const categories = req.body.categories ?? [];
    const timeInfos = await this.listTimeOption(req, 0, 2);

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
    const ids = listings.map((listing) => listing.id);
    const listingImages = await this.listingModel.getListingListImages(ids);

    const listingsWithImages = listings.map((listing) => {
      listing["images"] = listingImages.filter(
        (image) => image.listingId === listing.id
      );
      return listing;
    });

    return {
      items: listingsWithImages,
      options,
      countItems,
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

    const ids = listings.map((listing) => listing.id);
    const listingImages = await this.listingModel.getListingListImages(ids);

    const listingsWithImages = listings.map((listing) => {
      listing["images"] = listingImages.filter(
        (image) => image.listingId === listing.id
      );
      return listing;
    });

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

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dataToSave = req.body;
      const { userId } = req.userData;
      dataToSave["ownerId"] = userId;
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
        { ...dataToSave, listingId, listingImages: listingImagesToRes }
      );
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

  baseUpdate = async (req, res) => {
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
      return await this.baseUpdate(req, res);
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
      return await this.baseUpdate(req, res);
    });

  createByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
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
        { ...dataToSave, listingId, listingImages: listingImagesToRes }
      );
    });

  baseDelete = async (req, res) => {
    const { id } = req.body;
    const { deletedImagesInfos } = await this.listingModel.deleteById(id);
    this.removeListingImages(deletedImagesInfos);
    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await this.checkForbidden(req);
      if (forbidden) return forbidden;

      return await this.baseDelete(req, res);
    });

  deleteByAdmin = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      return await this.baseDelete(req, res);
    });
}

module.exports = new ListingController();
