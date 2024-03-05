const STATIC = require("../static");
const Controller = require("./Controller");
const lodash = require("lodash");

class ListingController extends Controller {
  baseListingList = async (req, userId = null) => {
    const { options, countItems } = await this.baseList(req, ({ filter }) =>
      this.listingModel.totalCount(filter, userId)
    );

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

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseListingList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  getCurrentUserList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await this.baseListingList(req, userId);
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

    const folder = "listings";
    const filesToSave = [];

    req.files.forEach((file) => {
      const filePath = this.moveUploadsFileToFolder(file, folder);
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
    const { userId } = req.userData;
    dataToSave["ownerId"] = userId;
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

      return await this.baseUpdate(req, res);
    });

  updateByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      return await this.baseUpdate(req, res);
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
