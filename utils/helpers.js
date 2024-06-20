const STATIC = require("../static");

const indicateMediaTypeByExtension = (type) => {
  if (STATIC.VIDEO_EXTENSIONS.includes(type.toLowerCase())) return "video";
  if (STATIC.AUDIO_EXTENSIONS.includes(type.toLowerCase())) return "audio";
  if (STATIC.IMAGE_EXTENSIONS.includes(type.toLowerCase())) return "image";
  return "file";
};

module.exports = {
  indicateMediaTypeByExtension,
};
