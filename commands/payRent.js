const { userModel, recipientPaymentModel } = require("../models");
const STATIC = require("../static");
const { sendMoneyToPaypalByPaypalID } = require("../utils");

const main = async () => {
  const maxCountCheck = 10;
  let needCheckMore = true;
  let currentCheckCount = 0;

  while (needCheckMore && maxCountCheck > currentCheckCount) {
    currentCheckCount++;
    const paymentInfos = await recipientPaymentModel.getToPaymentsPay();
    const toCompletedIds = [];

    for (let i = 0; i < paymentInfos.length; i++) {
      const payment = paymentInfos[i];

      try {
        if (!payment.paypalId || payment.paypalId.length < 1) {
          throw new Error(
            "The paypal id is not specified - it is impossible to perform the operation without a paypal id"
          );
        }

        await sendMoneyToPaypalByPaypalID(payment.paypalId, payment.money);

        toCompletedIds.push(payment.id);
      } catch (err) {
        console.log(err.message);
        await recipientPaymentModel.markAsFailed(payment.id, err.message);
      }
    }

    await recipientPaymentModel.markAsCompletedByIds(toCompletedIds);

    needCheckMore =
      paymentInfos.length == STATIC.INFINITY_SELECT_ITERATION_LIMIT;
  }

  process.exit();
};

main();
