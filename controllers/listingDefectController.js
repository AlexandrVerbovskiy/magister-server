const STATIC = require("../static");
const Controller = require("./Controller");

class ListingDefectController extends Controller {
  saveList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dbDefects = await this.listingDefectModel.getAll();
      console.log(dbDefects);
      const resList = [];
      
      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "List saved successfully",
        resList
      );
    });
}

module.exports = new ListingDefectController();
