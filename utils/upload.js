require("dotenv").config();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const STATIC = require("../static");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(STATIC.MAIN_DIRECTORY, "uploads");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
});

const maxFileSize = Number(process.env.MAX_FILE_SIZE ?? 26214400);

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
});

const maxSmallFileSize = Number(process.env.MAX_SMALL_FILE_SIZE ?? 1048576);

const smallUpload = multer({
  storage: storage,
  limits: {
    fileSize: maxSmallFileSize,
  },
});

module.exports = { upload, smallUpload };
