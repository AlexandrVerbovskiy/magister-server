require("dotenv").config();
const STATIC = require("../static");
const multer = require("multer");
const byteConverter = require("../utils/byteConverter");
const { ImageValidationError } = require("../utils/errors");

const isBaseFileLimit = (err, req, res, next, baseLimit) => {
  if (err instanceof ImageValidationError) {
    return res.status(STATIC.ERRORS.SIZE_LIMIT.STATUS).json({
      isError: true,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    const size = byteConverter(Number(baseLimit));

    return res.status(STATIC.ERRORS.SIZE_LIMIT.STATUS).json({
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

const isSummaryFileLimit = (req, res, next) => {
  const maxTotalFileSize = process.env.MAX_SUMMARY_FILE_SIZE;
  const size = byteConverter(Number(maxTotalFileSize));

  const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > maxTotalFileSize) {
    return res.status(STATIC.ERRORS.SIZE_LIMIT.STATUS).json({
      isError: true,
      message: "The total size of the files cannot be larger than " + size,
    });
  }

  next();
};

module.exports = { isFileLimit, isSmallFileLimit, isSummaryFileLimit };
