const STATIC = require("../static");
const { getFactOrderDays } = require("./dateHelpers");

const getPriceByDays = (pricePerDay, startDate, finishDate) =>
  getFactOrderDays(startDate, finishDate) * pricePerDay;

const paymentFeeCalculate = (price, fee) => {
  const resPayment = (fee * price) / 100;
  return +resPayment.toFixed(2);
};

const renterPaysFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_RENTER_COMMISSION) {
    return STATIC.LIMITS.MIN_RENTER_COMMISSION;
  }

  return result;
};

const ownerEarnFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_OWNER_COMMISSION) {
    return STATIC.LIMITS.MIN_OWNER_COMMISSION;
  }

  return result;
};

const renterPaysCalculate = (price, fee) => {
  const resPayment = price + renterPaysFeeCalculate(price, fee);
  return +resPayment.toFixed(2);
};

const ownerEarnCalculate = (price, fee) => {
  const resPayment = price = ownerEarnFeeCalculate(price, fee);
  return +resPayment.toFixed(2);
};

module.exports = {
  renterPaysCalculate,
  ownerEarnCalculate,
  renterPaysFeeCalculate,
  ownerEarnFeeCalculate,
  getPriceByDays,
};
