const STATIC = require("../static");
const Controller = require("./Controller");

class ListingApprovalRequestController extends Controller {
  baseRequestsList = async (req, userId = null) => {
    const timeInfos = await this.listTimeOption(req);

    const status = req.body.status;

    const { options, countItems } = await this.baseList(
      req,
      ({ filter = "" }) =>
        this.listingApprovalRequestModel.totalCount(
          filter,
          timeInfos["serverFromTime"],
          timeInfos["serverToTime"],
          userId
        )
    );

    Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

    options["userId"] = userId;
    options["status"] = status;
    const requests = await this.listingApprovalRequestModel.list(options);

    return {
      items: requests,
      options,
      countItems,
    };
  };

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const result = await this.baseRequestsList(req, userId);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  adminList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.baseRequestsList(req);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  create = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userId = req.userData.userId;
      const { listingId } = req.body;

      const listing = await this.listingModel.hasAccess(listingId, userId);

      if (!listing) {
        return this.sendErrorResponse(res, STATIC.ERRORS.FORBIDDEN);
      }

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

      const requestId = await this.listingApprovalRequestModel.create(
        listingId
      );

      this.saveUserAction(
        req,
        `Send a request to create a listing with name ${listing.name}`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        id: requestId,
      });
    });

  approve = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { listingId } = req.body;
      await this.listingApprovalRequestModel.approve(listingId);

      const listing = await this.listingModel.getById(listingId);

      this.saveUserAction(
        req,
        `Accepted a request to create a listing with name ${listing.name}`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });

  reject = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { listingId, description } = req.body;

      await this.listingApprovalRequestModel.rejectApprove(
        listingId,
        description
      );

      const listing = await this.listingModel.getById(listingId);

      this.saveUserAction(
        req,
        `Rejected a request to create a listing with name ${listing.name}`
      );

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null);
    });
}

module.exports = new ListingApprovalRequestController();
