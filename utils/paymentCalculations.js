const { getDaysDifference } = require("./dateHelpers");

const tenantPaymentCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getDaysDifference(startDay, endDay);
  const resPayment = (duration * (100 + fee) * pricePerDay) / 100;
  return +resPayment.toFixed(2);
};

const ownerGetsCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getDaysDifference(startDay, endDay);
  const resPayment = (duration * (100 - fee) * pricePerDay) / 100;
  return +resPayment.toFixed(2);
};

module.exports = {
  tenantPaymentCalculate,
  ownerGetsCalculate,
};