require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const CHECKLISTS_TABLE = STATIC.TABLES.CHECKLISTS;
const CHECKLIST_IMAGES_TABLE = STATIC.TABLES.CHECKLIST_PHOTOS;

class ChecklistModel extends Model {
  visibleFields = [
    `${CHECKLISTS_TABLE}.id`,
    `${CHECKLISTS_TABLE}.item_matches_description as itemMatchesDescription`,
    `${CHECKLISTS_TABLE}.item_matches_photos as itemMatchesPhotos`,
    `${CHECKLISTS_TABLE}.item_fully_functional as itemFullyFunctional`,
    `${CHECKLISTS_TABLE}.parts_good_condition as partsGoodCondition`,
    `${CHECKLISTS_TABLE}.provided_guidelines as providedGuidelines`,
    `${CHECKLISTS_TABLE}.type`,
    `${CHECKLISTS_TABLE}.order_id as orderId`,
  ];

  imageVisibleFields = [
    `${CHECKLIST_IMAGES_TABLE}.id`,
    `${CHECKLIST_IMAGES_TABLE}.checklist_id as checklistId`,
    `${CHECKLIST_IMAGES_TABLE}.link`,
  ];

  getImages = async (checklistId) =>
    await db(CHECKLIST_IMAGES_TABLE)
      .where("checklist_id", checklistId)
      .select(this.imageVisibleFields);

  create = async ({
    itemMatchesDescription = null,
    itemMatchesPhotos = null,
    itemFullyFunctional = null,
    partsGoodCondition = null,
    providedGuidelines = null,
    type,
    orderId,
    images,
  }) => {
    const res = await db(CHECKLISTS_TABLE)
      .insert({
        item_matches_description: itemMatchesDescription,
        item_matches_photos: itemMatchesPhotos,
        item_fully_functional: itemFullyFunctional,
        parts_good_condition: partsGoodCondition,
        provided_guidelines: providedGuidelines,
        type,
        order_id: orderId,
      })
      .returning("id");

    const checklistId = res[0]["id"];
    const imageInsertData = images.map((image) => ({
      checklist_id: checklistId,
      link: image.link,
    }));

    await db(CHECKLIST_IMAGES_TABLE).insert(imageInsertData).returning("id");
    const currentChecklistImages = await this.getImages(checklistId);

    return {
      checklistId,
      checklistImages: currentChecklistImages,
    };
  };

  createByTenant = ({
    itemMatchesDescription = null,
    itemMatchesPhotos = null,
    itemFullyFunctional = null,
    partsGoodCondition = null,
    providedGuidelines = null,
    orderId,
    images,
  }) =>
    this.create({
      itemMatchesDescription,
      itemMatchesPhotos,
      itemFullyFunctional,
      partsGoodCondition,
      providedGuidelines,
      orderId,
      images,
      type: STATIC.CHECKLIST_TYPES.TENANT,
    });

  createByOwner = ({
    itemMatchesDescription = null,
    itemMatchesPhotos = null,
    itemFullyFunctional = null,
    partsGoodCondition = null,
    providedGuidelines = null,
    orderId,
    images,
  }) =>
    this.create({
      itemMatchesDescription,
      itemMatchesPhotos,
      itemFullyFunctional,
      partsGoodCondition,
      providedGuidelines,
      orderId,
      images,
      type: STATIC.CHECKLIST_TYPES.OWNER,
    });
}

module.exports = new ChecklistModel();
