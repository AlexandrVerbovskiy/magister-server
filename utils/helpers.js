const STATIC = require("../static");
const {
  generateDatesBetween,
  checkStartEndHasConflict,
} = require("./dateHelpers");

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

const removeDuplicates = (arr) => [...new Set(arr)];

const getOrderBlockedDatesToUpdate = (conflictOrders) => {
  let blockedDatesToUpdate = [];

  conflictOrders.map((conflictOrder) => {
    const startDate = conflictOrder.requestId
      ? conflictOrder.newStartDate
      : conflictOrder.offerStartDate;

    const endDate = conflictOrder.requestId
      ? conflictOrder.newEndDate
      : conflictOrder.offerEndDate;

    blockedDatesToUpdate = [
      ...blockedDatesToUpdate,
      ...generateDatesBetween(startDate, endDate),
    ];
  });

  return removeDuplicates(blockedDatesToUpdate);
};

const isOrderCanBeAccepted = (order, conflictOrders) => {
  if (
    order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.disputeId ||
    order.cancelStatus
  ) {
    return true;
  }

  const orderStartDate = order.requestId
    ? order.newStartDate
    : order.offerStartDate;

  const orderEndDate = order.requestId ? order.newEndDate : order.offerEndDate;
  const blockedDates = getOrderBlockedDatesToUpdate(conflictOrders);

  return !checkStartEndHasConflict(orderStartDate, orderEndDate, blockedDates);
};

const truncateString = (str) => {
  const maxLength = 255;
  const truncatedLength = 250;

  if (str.length > maxLength) {
    return str.substring(0, truncatedLength) + "...";
  } else {
    return str;
  }
};

module.exports = {
  indicateMediaTypeByExtension,
  determineStepType,
  incrementDateCounts,
  incrementDateSums,
  isPayedUsedPaypal,
  removeDuplicates,
  isOrderCanBeAccepted,
  truncateString,
};
