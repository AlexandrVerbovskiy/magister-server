const STATIC = require("../static");
const Controller = require("./Controller");

class ListingDefectController extends Controller {
  saveList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dbDefects = await this.listingDefectModel.getAll();
      const { defects: defectsToSave } = req.body;

      const existsRelationDefectIds = dbDefects.map((defect) => defect.id);
      const defectsToSaveIds = defectsToSave.map((item) => item.id);

      const relationDefectsToDelete = existsRelationDefectIds.filter(
        (id) => !defectsToSaveIds.includes(id)
      );
      const relationItemsToCreate = defectsToSaveIds.filter(
        (id) => !existsRelationDefectIds.includes(id)
      );

      await this.listingDefectModel.deleteList(relationDefectsToDelete);

      for (const elem of defectsToSave) {
        if (relationItemsToCreate.includes(elem.id)) {
          await this.listingDefectModel.create({
            name: elem.name,
            orderIndex: elem.orderIndex,
          });
        } else {
          await this.listingDefectModel.update(
            { name: elem.name, orderIndex: elem.orderIndex },
            elem.id
          );
        }
      }

      const list = await this.listingDefectModel.getAll();

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "List saved successfully",
        list
      );
    });
}

module.exports = ListingDefectController;
