require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");
const ORDERS_TABLE = STATIC.TABLES.ORDERS;
const USERS_TABLE = STATIC.TABLES.USERS;

class BaseCommentModel extends Model {
  approve = async (commentId) => {
    await db(this.table).where({ id: commentId }).update({
      approved: true,
      waiting_admin: false,
    });
  };

  reject = async (commentId, description) => {
    await db(this.table).where({ id: commentId }).update({
      approved: true,
      waiting_admin: false,
      rejected_description: description,
    });
  };

  queryByType = (query, type) => {
    if (type == "approved") {
      query = query.whereRaw(`${this.table}.approved = TRUE`);
    }

    if (type == "rejected") {
      query = query.whereRaw(
        `${this.table}.approved = FALSE AND ${this.table}.waiting_admin = FALSE`
      );
    }
    if (type == "suspended") {
      query = query.whereRaw(`${this.table}.waiting_admin = TRUE`);
    }

    return query;
  };

  totalCount = async ({ filter, timeInfos, type = null }) => {
    let query = this.baseSelect().whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${this.table}.created_at`
    );

    query = this.queryByType(query, type);

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count, type = null } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.baseSelect()
      .select(this.visibleFields)
      .whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(
      props.timeInfos,
      query,
      `${this.table}.created_at`
    );

    query = this.queryByType(query, type);

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  listForEntity = async (entityId, count = 20, start = 0) => {
    const subquery = db(this.table)
      .select(db.raw(`MAX(${this.table}.id) AS latest_comment_id`))
      .innerJoin(ORDERS_TABLE, `${ORDERS_TABLE}.id`, `${this.table}.order_id`)
      .where(`${this.table}.approved`, true)
      .where(this.keyField, entityId);

    let query = db(this.table);
    query = this.baseJoin(query);
    query = query
      .select(this.visibleFields)
      .whereIn(`${this.table}.id`, subquery)
      .orderBy(`${this.table}.created_at`, "desc")
      .limit(count)
      .offset(start);

    return await query;
  };

  bindAverageForKeyEntities = async (
    entities,
    entityKey = "id",
    keyFieldNames = {
      commentCountName: "commentCount",
      averageRatingName: "averageRating",
    }
  ) => {
    const entityIds = entities.map((entity) => entity[entityKey]);

    const data = await this.baseSelect()
      .whereIn(`${this.keyField}`, entityIds)
      .where(`${this.table}.approved`, true)
      .where(`${this.table}.waiting_admin`, false)
      .select(this.visibleFields);

    entities.forEach((entity, index) => {
      let count = 0;
      let average = 0;

      data.forEach((row) => {
        if (row[this.keyFieldName] == entity[entityKey]) {
          count++;
          average +=
            this.pointFields.reduce(
              (prevValue, pointField) => (prevValue += row[pointField]),
              0
            ) / this.pointFields.length;
        }
      });

      if (count) {
        average /= count;
      }

      entities[index][keyFieldNames.commentCountName] = count;
      entities[index][keyFieldNames.averageRatingName] = average;
    });

    return entities;
  };

  checkOrderHasComment = async (orderId) => {
    const result = await this.baseSelect()
      .where(`${this.table}.order_id`, orderId)
      .first();

    return !!result;
  };

  getCommentTypesCount = async ({ timeInfos, filter }) => {
    let query = this.baseSelect().whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter(
      timeInfos,
      query,
      `${this.table}.created_at`
    );

    const result = await query
      .select(
        db.raw(`COUNT(*) AS "allCount"`),
        db.raw(
          `SUM(CASE WHEN ${this.table}.approved = TRUE THEN 1 ELSE 0 END) AS "approvedCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${this.table}.approved = FALSE AND ${this.table}.waiting_admin = FALSE THEN 1 ELSE 0 END) AS "rejectedCount"`
        ),
        db.raw(
          `SUM(CASE WHEN ${this.table}.waiting_admin = TRUE THEN 1 ELSE 0 END) AS "suspendedCount"`
        )
      )
      .first();

    return {
      allCount: result["allCount"] ?? 0,
      approvedCount: result["approvedCount"] ?? 0,
      rejectedCount: result["rejectedCount"] ?? 0,
      suspendedCount: result["suspendedCount"] ?? 0,
    };
  };
}

module.exports = BaseCommentModel;
