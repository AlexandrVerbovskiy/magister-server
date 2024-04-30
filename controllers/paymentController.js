const STATIC = require("../static");
const { createStripePayment, getStripeBalance, createPrice, createFullStripePaymentLink } = require("../utils");
const Controller = require("./Controller");

class PaymentController extends Controller {
  constructor() {
    super();
  }

  createPaymentIntent = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, amount } = req.body;

      try {
        const payment = await createStripePayment({
          payment_method: id,
          amount,
        });

        return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
          status: payment.status,
        });
      } catch (e) {
        console.log("Error: ", e);

        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          e.message
        );
      }
    });

  test = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const test = await createFullStripePaymentLink();
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, null, {
        status: test,
      });
    });
}

module.exports = new PaymentController();
