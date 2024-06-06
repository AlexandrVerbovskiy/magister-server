require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

class BaseCommentModel extends Model {
  approve = async (commentId) => {
    await db(this.table)
      .where({ id: commentId })
      .update({
        approved: true,
        waiting_admin: false,
      })
      .returning("id");
  };

  reject = async (commentId, description) => {
    await db(this.table)
      .where({ id: commentId })
      .update({
        approved: true,
        waiting_admin: false,
        rejected_description: description,
      })
      .returning("id");
  };

  queryByStatus = (query, status) => {
    if (status == "approved") {
      query = query.where(`${this.table}.approved = TRUE`);
    }

    if (status == "rejected") {
      query = query.where(
        `${this.table}.approved = FALSE AND ${this.table}.waiting_admin = FALSE`
      );
    }

    if (status == "suspended") {
      query = query.where(`${this.table}.waiting_admin = TRUE`);
    }

    return query;
  };

  totalCount = async (filter, timeInfos, status = null) => {
    let query = this.baseSelect().whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter(timeInfos, query);

    query = this.queryByStatus(query, status);

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = this.baseListTimeFilter
      .select(this.visibleFields)
      .whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(props.timeInfos, query);

    query = this.queryByStatus(query, status);

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  listForEntity = async (entityId, count, start) => {
    return await this.baseSelect()
      .where(`${this.table}.${this.keyField}`, entityId)
      .limit(count)
      .groupBy([`${this.table}.reviewer_id`, `${this.table}.${this.keyField}`])
      .offset(start);
  };

  averageForListings = async (entityIds) => {
    const data = this.baseSelect()
      .whereIn(`${this.table}.${this.keyField}`, entityIds)
      .where({ approved: true, waiting_admin: false })
      .groupBy([`${this.table}.reviewer_id`, `${this.table}.${this.keyField}`]);

    const res = {};

    entityIds.forEach((id) => {
      let count = 0;
      let average = 0;

      data.forEach((row) => {
        if (row[this.keyFieldName] == id) {
          count++;
          this.pointFields((pointField) => (average += row[pointField]));
        }
      });

      if (count) {
        average /= count;
      }

      res[id] = { count, average };
    });

    return res;
  };
}

module.exports = new BaseCommentModel();
