require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const DISPUTE_PREDICTION_MODEL_TABLE = STATIC.TABLES.DISPUTE_PREDICTION_MODELS;

class DisputePrediction extends Model {
  visibleFields = [
    "id",
    "accuracy",
    "active",
    "after_finish_active as afterFinishActive",
    "after_finish_rebuild as afterFinishRebuild",
    "started",
    "stopped",
    "finished",
    "checked",
    "body",
    "check_field as checkField",
    "created_at as createdAt",
    "training_percent as progressPercent",
    "prediction_details as predictionDetails",
    "selected_fields as selectedFields",
  ];

  orderFields = ["id", "created_at"];

  create = async ({
    body,
    afterFinishActive = false,
    afterFinishRebuild = false,
    checkField = "",
  }) => {
    const result = await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .insert({
        accuracy: 0,
        active: false,
        after_finish_active: afterFinishActive,
        after_finish_rebuild: afterFinishRebuild,
        body: JSON.stringify(body),
        check_field: checkField,
      })
      .returning("id");

    return result[0]["id"];
  };

  setActive = async (id, afterFinishRebuild) => {
    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where("active", true)
      .where({ id })
      .update({ active: false });

    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where({ id })
      .update({ active: true, after_finish_rebuild: afterFinishRebuild });
  };

  setStartTrainingStatus = async (id, selectedFields) => {
    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where({ id, selected_fields: selectedFields })
      .update({ started: true });
  };

  stop = async (id) => {
    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where({ id })
      .update({ stopped: true });
  };

  unstop = async (id) => {
    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where({ id })
      .update({ stopped: false });
  };

  update = async (
    id,
    {
      body,
      afterFinishActive = false,
      afterFinishRebuild = false,
      checkField = "",
    }
  ) => {
    await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .where({ id })
      .update({
        stopped: false,
        body: JSON.stringify(body),
        after_finish_active: afterFinishActive,
        after_finish_rebuild: afterFinishRebuild,
        check_field: checkField,
      });
  };

  getDetailsById = async (id) => {
    const actions = await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .select(this.visibleFields)
      .where({ id });
    return actions[0];
  };

  totalCount = async () => {
    const result = await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .count("* as count")
      .first();
    return +result?.count;
  };

  list = async (props) => {
    const { start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    return await db(DISPUTE_PREDICTION_MODEL_TABLE)
      .select(this.visibleFields)
      .orderBy(order, orderType)
      .limit(count)
      .offset(start);
  };
}

module.exports = new DisputePrediction();
