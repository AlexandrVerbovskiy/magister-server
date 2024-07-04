const STATIC = require("../static");

const indicateMediaTypeByExtension = (type) => {
  if (STATIC.VIDEO_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.VIDEO;
  if (STATIC.AUDIO_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.AUDIO;
  if (STATIC.IMAGE_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.IMAGE;
  return STATIC.MESSAGE_TYPES.FILE;
};

const determineStepType = (timeFilterType) => {
  if (timeFilterType === "last-year") return "months";
  if (timeFilterType === "last-day") return "hours";
  return "days";
};

const incrementDateCounts = (counts, infos, checkFn) => {
  infos.forEach((info) => {
    Object.keys(counts).forEach((key) => {
      if (checkFn(key, info)) {
        counts[key]++;
      }
    });
  });
};

const incrementDateSums = (sums, infos, checkFn, sumFn) => {
  infos.forEach((info) => {
    Object.keys(sums).forEach((key) => {
      if (checkFn(key, info)) {
        sums[key] += sumFn(info);
      }
    });
  });
};

const isPayedUsedPaypal = (type) =>
  [STATIC.PAYMENT_TYPES.PAYPAL, STATIC.PAYMENT_TYPES.CREDIT_CARD].includes(
    type
  );

module.exports = {
  indicateMediaTypeByExtension,
  determineStepType,
  incrementDateCounts,
  incrementDateSums,
  isPayedUsedPaypal,
};
