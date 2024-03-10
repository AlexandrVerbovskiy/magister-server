require("dotenv").config();
const STATIC = require("../static");
const multer = require("multer");
const byteConverter = require("../utils/byteConverter");

const isBaseFileLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const size = byteConverter(Number(baseLimit));

    return res.status(STATIC.ERRORS.BAD_REQUEST.STATUS).json({
      isError: true,
      message: "File can't be larger than " + size,
    });
  }
  next(err);
};

const isFileLimit = (err, req, res, next) =>
  isBaseFileLimit(err, req, res, next, process.env.MAX_FILE_SIZE);

const isSmallFileLimit = (err, req, res, next) =>
  isBaseFileLimit(err, req, res, next, process.env.MAX_SMALL_FILE_SIZE);

module.exports = { isFileLimit, isSmallFileLimit };
