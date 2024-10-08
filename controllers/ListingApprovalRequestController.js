const STATIC = require("../static");
const Controller = require("./Controller");

class ListingApprovalRequestController extends Controller {
  baseRequestsList = async (req, userId = null) => {
    const timeInfos = await this.getListTimeAutoOption(
      req,
      STATIC.TIME_FILTER_TYPES.TYPE
    );

    const status = req.body.status ?? "waiting";

    let { options, countItems } = await this.baseList(req, ({ filter = "" }) =>
      this.listingApprovalRequestModel.totalCount(
        filter,
        timeInfos,
        userId,
        status
      )
    );

    options["userId"] = userId;
    options["status"] = status;
    options = this.addTimeInfoToOptions(options, timeInfos);

    const requests = await this.listingApprovalRequestModel.list(options);

    const requestsWithListingImages =
      await this.listingModel.listingsBindImages(requests, "listingId");

    const requestsWithOwnerRatingsListingImages =
      await this.ownerCommentModel.bindAverageForKeyEntities(
        requestsWithListingImages,
        "userId",
        {
          commentCountName: "ownerCommentCount",
          averageRatingName: "ownerAverageRating",
        }
      );

    return {
      items: requestsWithOwnerRatingsListingImages,
      options,
      countItems,
    };
  };

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
      await this.listingModel.approve(listingId);

      const listing = await this.listingModel.getFullWithoutImages(listingId);

      if (!listing) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.NOT_FOUND,
          "Listing wasn't found"
        );
      }

      this.saveUserAction(
        req,
        `Accepted a request to create a listing with name ${listing.name}`
      );

      this.sendListingVerifiedMail(listing.userEmail, listing.name, listing.id);

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

module.exports = ListingApprovalRequestController;
