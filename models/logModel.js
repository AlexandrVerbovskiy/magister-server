require("dotenv").config();
const bcrypt = require("bcrypt");
const STATIC = require("../static");
const db = require("../database");
const { formatDateToSQLFormat } = require("../utils");

const LOGS_TABLE = STATIC.TABLES.LOGS;

class LogModel {
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

  logFilter = (filter) => {
    filter = `%${filter}%`;
    const searchableFields = ["line", "file", "message"];

    const conditions = searchableFields
      .map((field) => `${field} ILIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return [`(${conditions})`, props];
  };

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

  getById = async (id) => {
    return await db(LOGS_TABLE)
      .where("id", id)
      .select(this.visibleFields)
      .first();
  };

  totalCount = async (filter, fromTime, toTime) => {
    let query = db(LOGS_TABLE).whereRaw(...this.logFilter(filter));

    if (fromTime) {
      query = query.where(
        "created_at",
        ">=",
        formatDateToSQLFormat(fromTime)
      );
    }

    if (toTime) {
      query = query.where(
        "created_at",
        "<=",
        formatDateToSQLFormat(toTime)
      );
    }

    const { count } = await query.count("* as count").first();
    return count;
  };

  list = async ({
    filter,
    order,
    orderType,
    start,
    count,
    fromTime,
    toTime,
  }) => {
    const canBeOrderField = ["id", "line", "file", "created_at"];

    if (!order) order = "id";
    if (!orderType) orderType = "asc";

    orderType = orderType.toLowerCase() === "desc" ? "desc" : "asc";
    order = canBeOrderField.includes(order.toLowerCase()) ? order : "id";

    let query = db(LOGS_TABLE)
      .select(this.visibleFields)
      .whereRaw(...this.logFilter(filter));

    if (fromTime) {
      query = query.where(
        "created_at",
        ">=",
        formatDateToSQLFormat(fromTime)
      );
    }

    if (toTime) {
      query = query.where(
        "created_at",
        "<=",
        formatDateToSQLFormat(toTime)
      );
    }

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
