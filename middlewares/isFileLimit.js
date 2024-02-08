require("dotenv").config();
const STATIC = require("../static");
const multer = require("multer");
const byteConverter = require("../utils/byteConverter");

const isFileLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const size = byteConverter(Number(process.env.MAX_FILE_SIZE));
    console.log(err.message);

    return res.status(STATIC.ERRORS.BAD_REQUEST.STATUS).json({
      isError: true,
      message: "File can't be larger than " + size,
    });
  }
  next(err);
};

module.exports = isFileLimit;
