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

module.exports = multer({ storage: storage });
