const express = require('express');
const router = express.Router();
const stripe = require("stripe");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.stripe_secret_signature
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Strip success payment: ", paymentIntent);
        break;
      case "payment_intent.payment_failed":
        const paymentFailedIntent = event.data.object;
        console.log("Strip fail payment: ", paymentFailedIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    response.send();
  }
);

module.exports = router;