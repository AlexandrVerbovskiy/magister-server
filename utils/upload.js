require("dotenv").config();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const STATIC = require("../static");
const { ImageValidationError } = require("./errors");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(STATIC.MAIN_DIRECTORY, "uploads");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
});

const imageFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);

  if (STATIC.IMAGE_EXTENSIONS.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new ImageValidationError("Only image files are allowed"), false);
  }
};

const maxFileSize = Number(process.env.MAX_FILE_SIZE ?? 26214400);
const maxSmallFileSize = Number(process.env.MAX_SMALL_FILE_SIZE ?? 1048576);

const multerUpload = {
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
};

const multerSmallUpload = {
  storage: storage,
  limits: {
    fileSize: maxSmallFileSize,
  },
};

const upload = multer(multerUpload);
const smallUpload = multer(multerSmallUpload);

const imageUpload = multer({
  ...multerUpload,
  fileFilter: imageFilter,
});

const smallImageUpload = multer({
  ...multerSmallUpload,
  fileFilter: imageFilter,
});

module.exports = {
  upload: upload,
  imageUpload: imageUpload,
  smallUpload,
  smallImageUpload,
};
