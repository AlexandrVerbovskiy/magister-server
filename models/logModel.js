require("dotenv").config();
const STATIC = require("../static");
const db = require("../database");
const Model = require("./Model");

const LOGS_TABLE = STATIC.TABLES.LOGS;

class LogModel extends Model {
  visibleFields = [
    "id",
    "success",
    "body",
    "message",
    "line",
    "file",
    "created_at as createdAt",
    "symbol",
  ];

  strFilterFields = ["line", "file", "message"];

  orderFields = ["id", "line", "file", "created_at"];

  create = async ({ success, message, body, line, symbol, file }) => {
    await db(LOGS_TABLE).insert({
      success,
      body,
      line,
      file,
      message,
      symbol,
    });
  };

  getById = (id) => this.baseGetById(id, LOGS_TABLE);

  totalCount = async (filter, serverFromTime, serverToTime) => {
    let query = db(LOGS_TABLE).whereRaw(...this.baseStrFilter(filter));
    query = this.baseListTimeFilter({ serverFromTime, serverToTime }, query);
    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async (props) => {
    const { filter, start, count } = props;
    const { order, orderType } = this.getOrderInfo(props);

    let query = db(LOGS_TABLE)
      .select(this.visibleFields)
      .whereRaw(...this.baseStrFilter(filter));

    query = this.baseListTimeFilter(props, query);

    return await query.orderBy(order, orderType).limit(count).offset(start);
  };

  saveByBodyError = async (body, message) => {
    const errorRows = body.split("\n");
    const mainErrorInfo = errorRows[1];

    let filename = "-";
    let lineNumber = "-";
    let symbolNumber = "-";

    if (mainErrorInfo.includes(".js:")) {
      const splitRes1 = mainErrorInfo.split(".js:");
      filename = splitRes1[0];
      filename = filename.replaceAll(" at ", "").trim() + ".js";

      const lineInfo = splitRes1[1];

      if (lineInfo.includes(":")) {
        const splitRes2 = lineInfo.split(":");
        lineNumber = splitRes2[0];
        symbolNumber = splitRes2[1];
      }
    }

    await this.create({
      success: false,
      body: body,
      message: message,
      line: lineNumber,
      file: filename,
      symbol: symbolNumber,
    });
  };
}

module.exports = new LogModel();
