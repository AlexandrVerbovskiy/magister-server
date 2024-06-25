const STATIC = require("../static");
const Controller = require("./Controller");

class ListingDefectQuestionController extends Controller {
  saveList = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const dbQuestions = await this.listingDefectQuestionModel.getAll();
      const { questions: questionsToSave } = req.body;

      const existsRelationQuestionIds = dbQuestions.map((question) => question.id);
      const questionsToSaveIds = questionsToSave.map((item) => item.id);

      const relationQuestionsToDelete = existsRelationQuestionIds.filter(
        (id) => !questionsToSaveIds.includes(id)
      );
      const relationItemsToCreate = questionsToSaveIds.filter(
        (id) => !existsRelationQuestionIds.includes(id)
      );

      await this.listingDefectQuestionModel.deleteList(relationQuestionsToDelete);

      for (const elem of questionsToSave) {
        if (relationItemsToCreate.includes(elem.id)) {
          await this.listingDefectQuestionModel.create({
            name: elem.name,
            orderIndex: elem.orderIndex,
          });
        } else {
          await this.listingDefectQuestionModel.update(
            { name: elem.name, orderIndex: elem.orderIndex },
            elem.id
          );
        }
      }

      const list = await this.listingDefectQuestionModel.getAll();

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        "List saved successfully",
        list
      );
    });
}

module.exports = ListingDefectQuestionController;
