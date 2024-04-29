const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeCustomer = async () => {
  const param = {};
  param.email = "mike@gmail.com";
  param.name = "Mike";
  param.description = "from node";

  return await stripe.customers.create(param);
};

const retrieveStripeCustomer = async () => {
  return await stripe.customers.retrieve("cus_Gi1jjdxYhsaMN2");
};

const createStripeToken = async () => {
  const param = {};
  param.card = {
    number: "4242424242424242",
    exp_month: 2,
    exp_year: 2024,
    cvc: "212",
  };

  return await stripe.tokens.create(param);
};

const addStripeCardToCustomer = async () => {
  return await stripe.customers.createSource("cus_Gi1jjdxYhsaMN2", {
    source: "tok_1GAcj5CEXnEqdvqzXq4VFPGJ",
  });
};

const chargeStripeCustomerThroughCustomerID = async () => {
  const param = {
    amount: "2000",
    currency: "usd",
    description: "First payment",
    customer: "cus_Gi1jjdxYhsaMN2",
  };

  return await stripe.charges.create(param);
};

const chargeStripeCustomerThroughTokenID = async () => {
  const param = {
    amount: "2000",
    currency: "usd",
    description: "First payment",
    source: "tok_1GFGKuCEXnEqdvqz10yhHl8s",
  };

  return await stripe.charges.create(param);
};

const getAllStripeCustomers = async () => {
  return await stripe.customers.list({ limit: 4 });
};

const createStripePayment = async ({ id, amount }) => {
  return await stripe.paymentIntents.create({
    payment_method: id,
    amount,
    currency: "USD",
    description: `Order from test`,
    confirm: true,
    return_url: process.env.CLIENT_URL + "/",
  });
};

const createPrice = async () => {
  return await stripe.prices.create({
    currency: "usd",
    unit_amount: 1000,
    product_data: {
      name: "Gold Plan 12",
    },
  });
};

const createStripePaymentLink = async (priceId, quantity) => {
  return await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity: quantity,
      },
    ],
  });
};

const createFullStripePaymentLink = async () => {
  const price = await createPrice();
  return await createStripePaymentLink(price.id, 1);
};

const getStripeBalance = async () => {
  const balanceInfo = await stripe.balance.retrieve();
  let result = 0;

  if (balanceInfo && balanceInfo.pending) {
    balanceInfo.pending.forEach(
      (balancePart) => (result += balancePart.amount)
    );
  }

  return result;
};

module.exports = {
  createStripePayment,
  getAllStripeCustomers,
  createStripeCustomer,
  chargeStripeCustomerThroughTokenID,
  chargeStripeCustomerThroughCustomerID,
  addStripeCardToCustomer,
  createStripeToken,
  retrieveStripeCustomer,
  getStripeBalance,
  createPrice,
  createStripePaymentLink,
  createFullStripePaymentLink,
};
