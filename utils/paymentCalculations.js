const { getFactOrderDays } = require("./dateHelpers");
const STATIC = require("../static");

const paymentFeeCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);
  const resPayment = (duration * fee * pricePerDay) / 100;
  return +resPayment.toFixed(2);
};

const tenantPaymentFeeCalculate = (startDay, endDay, fee, pricePerDay) => {
  const result = paymentFeeCalculate(startDay, endDay, fee, pricePerDay);

  if (result < STATIC.LIMITS.MIN_TENANT_COMMISSION) {
    return STATIC.LIMITS.MIN_TENANT_COMMISSION;
  }
};

const ownerGetsFeeCalculate = paymentFeeCalculate;

const tenantPaymentCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);

  const resPayment =
    duration * pricePerDay +
    tenantPaymentFeeCalculate(startDay, endDay, fee, pricePerDay);

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
  tenantPaymentCalculate,
  ownerGetsCalculate,
  tenantPaymentFeeCalculate,
  ownerGetsFeeCalculate,
};
