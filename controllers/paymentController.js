const STATIC = require("../static");
const { createStripePayment } = require("../utils");
const Controller = require("./Controller");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*const customer = await stripe.customers.create({
  name: 'Jenny Rosen',
  email: 'jennyrosen@example.com',
});*/

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
}

module.exports = new PaymentController();
