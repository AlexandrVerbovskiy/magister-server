const STATIC = require("../static");
const Controller = require("./Controller");
const lodash = require("lodash");

class ListingController extends Controller {
  getList = (req, res) => this.baseWrapper(req, res, async () => {});

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
    let listingImages = JSON.parse(req.body["listingImages"] ?? "[]");

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

      const id = await this.listingModel.create(dataToSave);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "Created successfully",
        { listingId: id, listingImages: dataToSave["listingImages"] }
      );
    });

  checkForbidden = async (req) => {
    const { id } = req.body;
    const { userId } = req.userData;

    const hasAccess = await this.listingModel.hasAccess(id, userId);

    if (!hasAccess()) {
      return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
    }
  };

  baseUpdate = (req, res) => {
    const dataToSave = req.body;
    const { userId } = req.userData;
    dataToSave["ownerId"] = userId;
    dataToSave["listingImages"] = this.localGetFiles(req);

    return this.sendSuccessResponse(
      res,
      STATIC.SUCCESS.OK,
      "Updated successfully"
    );
  };

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await checkForbidden(req);
      if (forbidden) return forbidden;

      return await this.baseUpdate(req, res);
    });

  updateByAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      return await this.baseUpdate(req, res);
    });

  baseDelete = async (req, res) => {
    const { id } = req.body;
    await this.listingModel.deleteById(id);
    return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
  };

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const forbidden = await checkForbidden(req);
      if (forbidden) return forbidden;

      return await this.baseDelete(req, res);
    });

  deleteByAdmin = async (req, res) =>
    this.baseWrapper(req, res, async () => {
      return await this.baseDelete(req, res);
    });
}

module.exports = new ListingController();
