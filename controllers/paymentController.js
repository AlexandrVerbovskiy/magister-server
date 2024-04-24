const STATIC = require("../static");
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
      console.log(id, amount);

      try {
        const payment = await stripe.paymentIntents.create({
          payment_method: id,
          amount,
          currency: "USD",
          description: `Order from test`,
          confirm: true,
          return_url: process.env.CLIENT_URL + "/",
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
