const { recipientPaymentModel } = require("../models");
const STATIC = require("../static");
const { sendMoneyToPaypalByPaypalID } = require("../utils");

const main = async () => {
  const maxCountCheck = 10;
  let needCheckMore = true;
  let currentCheckCount = 0;

  while (needCheckMore && maxCountCheck > currentCheckCount) {
    currentCheckCount++;
    const paymentInfos = await recipientPaymentModel.getToPaymentsPay();

    for (let i = 0; i < paymentInfos.length; i++) {
      const payment = paymentInfos[i];

      try {
        if (!payment.userPaypalId || payment.userPaypalId.length < 1) {
          throw new Error(
            "The paypal id is not specified - it is impossible to perform the operation without a paypal id"
          );
        }

        await sendMoneyToPaypalByPaypalID(payment.userPaypalId, payment.money);

        await recipientPaymentModel.markAsCompletedById(payment.id, payment.userPaypalId);
      } catch (err) {
        console.log(err.message);
        await recipientPaymentModel.markAsFailed(payment.id, payment.userPaypalId, err.message);
      }
    }

    needCheckMore =
      paymentInfos.length == STATIC.INFINITY_SELECT_ITERATION_LIMIT;
  }

  process.exit();
};

main();
