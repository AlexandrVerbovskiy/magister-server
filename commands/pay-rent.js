const { recipientPaymentModel } = require("../models");
const STATIC = require("../static");
const { sendMoneyToPaypalByPaypalID } = require("../utils");

const main = async () => {
  let needCheckMore = true;

  while (needCheckMore) {
    const paymentInfos = await recipientPaymentModel.getToPaymentsPay();

    for (let i = 0; i < paymentInfos.length; i++) {
      const payment = paymentInfos[i];
      const paypalId = payment.paypalId;

      try {
        if (!paypalId || paypalId.length < 1) {
          throw new Error(
            "The paypal id is not specified - it is impossible to perform the operation without a paypal id"
          );
        }

        await sendMoneyToPaypalByPaypalID(paypalId, payment.money);

        await recipientPaymentModel.markAsCompletedById(payment.id, {
          paypalId,
        });
      } catch (err) {
        console.log(err.message);
        await recipientPaymentModel.markAsFailed(
          payment.id,
          { paypalId },
          err.message
        );
      }
    }

    needCheckMore =
      paymentInfos.length == STATIC.INFINITY_SELECT_ITERATION_LIMIT;
  }

  process.exit();
};

main();
