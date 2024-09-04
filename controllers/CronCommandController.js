const Controller = require("./Controller");
const db = require("../database");
const STATIC = require("../static");
const { sendMoneyToPaypalByPaypalID } = require("../utils");

class CronCommandController extends Controller {
  baseReset = async (model) => {
    return await db(model).where("id", ">", 0).delete();
  };

  basePayRentForOwners = async () => {
    const paymentInfos = await this.recipientPaymentModel.getToPaymentsPay();

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

        await this.recipientPaymentModel.markAsCompletedById(payment.id, {
          paypalId,
        });
      } catch (err) {
        console.log(err.message);
        await this.recipientPaymentModel.markAsFailed(
          payment.id,
          { paypalId },
          err.message
        );
      }
    }
  };

  payRentForOwners = (req, res) =>
    this.baseWrapper(req, res, async () => {
      await this.basePayRentForOwners();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  resetDatabase = (req, res) =>
    this.baseWrapper(req, res, async () => {
      await this.baseReset(STATIC.TABLES.OWNER_COMMENTS);
      await this.baseReset(STATIC.TABLES.TENANT_COMMENTS);

      await this.baseReset(STATIC.TABLES.CHAT_MESSAGE_CONTENTS);
      await this.baseReset(STATIC.TABLES.CHAT_MESSAGES);
      await this.baseReset(STATIC.TABLES.CHAT_RELATIONS);
      await this.baseReset(STATIC.TABLES.CHATS);

      await this.baseReset(STATIC.TABLES.DISPUTES);
      await this.baseReset(STATIC.TABLES.RECIPIENT_PAYMENTS);
      await this.baseReset(STATIC.TABLES.SENDER_PAYMENTS);
      await this.baseReset(STATIC.TABLES.ORDER_UPDATE_REQUESTS);

      await this.baseReset(STATIC.TABLES.CHECKLIST_PHOTOS);
      await this.baseReset(STATIC.TABLES.CHECKLISTS);
      await db(STATIC.TABLES.ORDERS).whereNotNull("parent_id").delete();
      await this.baseReset(STATIC.TABLES.ORDERS);

      await this.baseReset(STATIC.TABLES.USER_LISTING_FAVORITES);
      await this.baseReset(STATIC.TABLES.LISTING_APPROVAL_REQUESTS);
      await this.baseReset(STATIC.TABLES.LISTING_CATEGORY_CREATE_NOTIFICATIONS);
      await this.baseReset(STATIC.TABLES.LISTING_IMAGES);
      await this.baseReset(STATIC.TABLES.LISTINGS);
      await this.baseReset(STATIC.TABLES.SEARCHED_WORDS);
      await this.baseReset(STATIC.TABLES.LISTING_CATEGORIES);

      await this.baseReset(STATIC.TABLES.LOGS);
      await this.baseReset(STATIC.TABLES.USER_EVENT_LOGS);
      await this.baseReset(STATIC.TABLES.ACTIVE_ACTIONS);
      await this.baseReset(STATIC.TABLES.PHONE_VERIFIED_CODES);
      await this.baseReset(STATIC.TABLES.SOCKETS);
      await this.baseReset(STATIC.TABLES.TWO_FACTOR_AUTH_CODES);
      await this.baseReset(STATIC.TABLES.USER_DOCUMENTS);
      await this.baseReset(STATIC.TABLES.USER_VERIFY_REQUESTS);
      await db(STATIC.TABLES.USERS).whereNot("email", "admin@ydk.com").delete();
      await db(STATIC.TABLES.USERS)
        .where("email", "admin@ydk.com")
        .update({ paypal_id: null });

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  emailTest = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const result = await this.sendProfileVerificationMail(
        "cofeek5@gmail.com"
      );
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, result);
    });

  test = (req, res) =>
    this.baseWrapper(req, res, async () => {
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        test: "123",
      });
    });
}

module.exports = CronCommandController;
