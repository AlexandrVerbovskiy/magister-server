const { getFactOrderDays } = require("./dateHelpers");
const STATIC = require("../static");

const paymentFeeCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);
  const resPayment = (duration * fee * pricePerDay) / 100;
  return +resPayment.toFixed(2);
};

const workerPaymentFeeCalculate = (startDay, endDay, fee, pricePerDay) => {
  const result = paymentFeeCalculate(startDay, endDay, fee, pricePerDay);

  if (result < STATIC.LIMITS.MIN_WORKER_COMMISSION) {
    return STATIC.LIMITS.MIN_WORKER_COMMISSION;
  }

  return result;
};

const ownerGetsFeeCalculate = paymentFeeCalculate;

const workerPaymentCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);

  const resPayment =
    duration * pricePerDay +
    workerPaymentFeeCalculate(startDay, endDay, fee, pricePerDay);

  return +resPayment.toFixed(2);
};

const ownerGetsCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);

  const resPayment =
    duration * pricePerDay -
    ownerGetsFeeCalculate(startDay, endDay, fee, pricePerDay);

  return +resPayment.toFixed(2);
};

module.exports = {
  workerPaymentCalculate,
  ownerGetsCalculate,
  workerPaymentFeeCalculate,
  ownerGetsFeeCalculate,
};
