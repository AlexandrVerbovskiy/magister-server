const { getFactOrderDays } = require("./dateHelpers");
const STATIC = require("../static");

const paymentFeeCalculate = (price, fee) => {
  const resPayment = (fee * price) / 100;
  return +resPayment.toFixed(2);
};

const workerGetsFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_WORKER_COMMISSION) {
    return STATIC.LIMITS.MIN_WORKER_COMMISSION;
  }

  return result;
};

const ownerPaymentFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_OWNER_COMMISSION) {
    return STATIC.LIMITS.MIN_OWNER_COMMISSION;
  }

  return result;
};

const workerGetsCalculate = (price, fee) => {
  const resPayment = price - workerGetsFeeCalculate(price, fee);
  return +resPayment.toFixed(2);
};

const ownerPaymentCalculate = (price, fee) => {
  const resPayment = price + ownerPaymentFeeCalculate(price, fee);
  return +resPayment.toFixed(2);
};

module.exports = {
  workerGetsCalculate,
  ownerPaymentCalculate,
  workerGetsFeeCalculate,
  ownerPaymentFeeCalculate,
};
